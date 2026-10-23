import { useCallback, useEffect, useRef, useState } from "react";
import { P2PRoom, type PeerInfo } from "./p2p";

export interface UseP2PRoomOptions {
  /** Defaults to a shared public room or custom room code */
  room?: string;
  name?: string;
  enabled?: boolean;
}

export interface P2PRoomHandle {
  selfId: string;
  room: string;
  /** Remote peers only (self excluded), with live connection diagnostics. */
  peers: PeerInfo[];
  joined: boolean;
  /** Unreliable game-state fanout to every connected peer. */
  broadcast: (data: unknown) => void;
  /** Reliable ordered send to one peer (or all when peerId is omitted). */
  send: (data: unknown, peerId?: string) => void;
  /** Subscribe to incoming messages; returns an unsubscribe function. */
  onMessage: (
    fn: (from: string, data: unknown, channel: "state" | "reliable") => void,
  ) => () => void;
}

function defaultRoom(): string {
  if (typeof window === "undefined") return "tooncar-gp";
  return "tooncar-gp";
}

export function useP2PRoom(options: UseP2PRoomOptions = {}): P2PRoomHandle {
  const [selfId] = useState(() => `racer-${Math.random().toString(36).slice(2, 9)}`);
  const room = options.room ?? defaultRoom();
  const name = options.name ?? selfId;
  const enabled = options.enabled !== false;
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [joined, setJoined] = useState(false);
  const roomRef = useRef<P2PRoom | null>(null);
  const listeners = useRef(
    new Set<(from: string, data: unknown, channel: "state" | "reliable") => void>(),
  );

  useEffect(() => {
    if (!enabled) {
      setJoined(false);
      setPeers([]);
      return;
    }
    const p2p = new P2PRoom({
      room,
      selfId,
      name,
      onPeersChanged: setPeers,
      onMessage: (from, data, channel) => {
        for (const fn of listeners.current) fn(from, data, channel);
      },
      onConnected: () => setJoined(true),
    });
    roomRef.current = p2p;
    void p2p.join();
    return () => {
      roomRef.current = null;
      p2p.close();
    };
  }, [room, selfId, name, enabled]);

  const broadcast = useCallback((data: unknown) => roomRef.current?.broadcast(data), []);
  const send = useCallback(
    (data: unknown, peerId?: string) => roomRef.current?.send(data, peerId),
    [],
  );
  const onMessage = useCallback(
    (fn: (from: string, data: unknown, channel: "state" | "reliable") => void) => {
      listeners.current.add(fn);
      return () => {
        listeners.current.delete(fn);
      };
    },
    [],
  );

  return { selfId, room, peers, joined, broadcast, send, onMessage };
}

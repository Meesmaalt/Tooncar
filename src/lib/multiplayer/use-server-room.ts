import { useCallback, useEffect, useRef, useState } from "react";
import type { SpeedClass } from "@/types";
import type { RemoteRacerSyncState, RoomSummary, ServerChatMessage, ServerRoom } from "./room.server";

export interface UseServerRoomOptions {
  playerName: string;
  carId: string;
  color: string;
  autoJoinHash?: boolean;
}

export function useServerRoom({ playerName, carId, color, autoJoinHash = true }: UseServerRoomOptions) {
  const [selfId] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("tooncar_player_id");
      if (stored) return stored;
      const gen = `racer-${Math.random().toString(36).slice(2, 9)}`;
      sessionStorage.setItem("tooncar_player_id", gen);
      return gen;
    }
    return `racer-${Math.random().toString(36).slice(2, 9)}`;
  });

  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ServerRoom | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pingMs, setPingMs] = useState<number | null>(null);

  const roomRef = useRef<ServerRoom | null>(null);
  roomRef.current = currentRoom;

  const currentRoomId = currentRoom?.id ?? null;
  const isHost = Boolean(currentRoom && currentRoom.hostId === selfId);

  // Fetch available rooms
  const refreshRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/rooms", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.rooms)) {
        setRooms(data.rooms);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Initial rooms load and periodic room browser refresh (every 4s when not in a room)
  useEffect(() => {
    refreshRooms();
    const timer = setInterval(() => {
      if (!roomRef.current) {
        refreshRooms();
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [refreshRooms]);

  // Create room
  const createRoom = useCallback(
    async (params: {
      id?: string;
      name: string;
      trackId: string;
      laps: number;
      speedClass: SpeedClass;
      isPublic?: boolean;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/rooms", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "create",
            ...params,
            creator: {
              id: selfId,
              name: playerName,
              carId,
              color,
            },
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Toa loomine ebaõnnestus");
        }
        setCurrentRoom(data.room);
        if (typeof window !== "undefined") {
          window.location.hash = `#room=${data.room.id}`;
        }
        return data.room as ServerRoom;
      } catch (err: any) {
        setError(err.message || "Viga toa loomisel");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selfId, playerName, carId, color],
  );

  // Join room
  const joinRoom = useCallback(
    async (roomId: string) => {
      setLoading(true);
      setError(null);
      try {
        const cleanId = roomId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
        const res = await fetch("/api/rooms", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "join",
            roomId: cleanId,
            player: {
              id: selfId,
              name: playerName,
              carId,
              color,
            },
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Toaga liitumine ebaõnnestus");
        }
        setCurrentRoom(data.room);
        if (typeof window !== "undefined") {
          window.location.hash = `#room=${data.room.id}`;
        }
        return data.room as ServerRoom;
      } catch (err: any) {
        setError(err.message || "Viga toaga liitumisel");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selfId, playerName, carId, color],
  );

  // Leave room
  const leaveRoom = useCallback(async () => {
    const roomId = roomRef.current?.id;
    if (!roomId) return;
    try {
      await fetch("/api/rooms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "leave",
          roomId,
          playerId: selfId,
        }),
      });
    } catch {
      /* ignore */
    } finally {
      setCurrentRoom(null);
      if (typeof window !== "undefined" && window.location.hash.includes("room=")) {
        window.location.hash = "";
      }
      refreshRooms();
    }
  }, [selfId, refreshRooms]);

  // Update settings (host only)
  const updateSettings = useCallback(
    async (settings: { name?: string; trackId?: string; laps?: number; speedClass?: SpeedClass }) => {
      const roomId = roomRef.current?.id;
      if (!roomId) return;
      try {
        const res = await fetch("/api/rooms", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "update_settings",
            roomId,
            hostId: selfId,
            settings,
          }),
        });
        const data = await res.json();
        if (data.ok && data.room) {
          setCurrentRoom(data.room);
        }
      } catch {
        /* ignore */
      }
    },
    [selfId],
  );

  // Toggle ready status
  const toggleReady = useCallback(async (ready?: boolean) => {
    const roomId = roomRef.current?.id;
    if (!roomId) return;
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "toggle_ready",
          roomId,
          playerId: selfId,
          ready,
        }),
      });
      const data = await res.json();
      if (data.ok && data.room) {
        setCurrentRoom(data.room);
      }
    } catch {
      /* ignore */
    }
  }, [selfId]);

  // Update profile
  const updateProfile = useCallback(
    async (profile: { name?: string; carId?: string; color?: string }) => {
      const roomId = roomRef.current?.id;
      if (!roomId) return;
      try {
        const res = await fetch("/api/rooms", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "update_profile",
            roomId,
            playerId: selfId,
            profile,
          }),
        });
        const data = await res.json();
        if (data.ok && data.room) {
          setCurrentRoom(data.room);
        }
      } catch {
        /* ignore */
      }
    },
    [selfId],
  );

  // Start race (host only)
  const startRace = useCallback(async () => {
    const roomId = roomRef.current?.id;
    if (!roomId) return;
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "start_race",
          roomId,
          hostId: selfId,
        }),
      });
      const data = await res.json();
      if (data.ok && data.room) {
        setCurrentRoom(data.room);
      }
    } catch {
      /* ignore */
    }
  }, [selfId]);

  // Return to lobby
  const returnToLobby = useCallback(async () => {
    const roomId = roomRef.current?.id;
    if (!roomId) return;
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "return_lobby",
          roomId,
          hostId: selfId,
        }),
      });
      const data = await res.json();
      if (data.ok && data.room) {
        setCurrentRoom(data.room);
      }
    } catch {
      /* ignore */
    }
  }, [selfId]);

  // Send chat
  const sendChat = useCallback(
    async (text: string) => {
      const roomId = roomRef.current?.id;
      if (!roomId || !text.trim()) return;
      try {
        await fetch("/api/rooms", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "chat",
            roomId,
            playerId: selfId,
            text,
          }),
        });
      } catch {
        /* ignore */
      }
    },
    [selfId],
  );

  // In-race / In-lobby sync loop
  const inSyncRef = useRef(false);
  const pendingSyncQueue = useRef<{
    state?: RemoteRacerSyncState;
    newProjectiles?: any[];
    takenBox?: { index: number };
    hit?: any;
    finishTime?: number;
  }>({});

  const queueSync = useCallback((patch: {
    state?: RemoteRacerSyncState;
    newProjectiles?: any[];
    takenBox?: { index: number };
    hit?: any;
    finishTime?: number;
  }) => {
    if (patch.state) pendingSyncQueue.current.state = patch.state;
    if (patch.newProjectiles) {
      pendingSyncQueue.current.newProjectiles = [
        ...(pendingSyncQueue.current.newProjectiles || []),
        ...patch.newProjectiles,
      ];
    }
    if (patch.takenBox) pendingSyncQueue.current.takenBox = patch.takenBox;
    if (patch.hit) pendingSyncQueue.current.hit = patch.hit;
    if (patch.finishTime != null) pendingSyncQueue.current.finishTime = patch.finishTime;
  }, []);

  // Polling / syncing loop
  useEffect(() => {
    if (!currentRoomId) return;

    let mounted = true;
    const intervalMs = currentRoom?.status === "racing" || currentRoom?.status === "countdown" ? 60 : 1000;

    const interval = setInterval(async () => {
      if (!mounted || inSyncRef.current) return;
      inSyncRef.current = true;

      const queue = pendingSyncQueue.current;
      pendingSyncQueue.current = {};

      const t0 = performance.now();
      try {
        const res = await fetch("/api/rooms", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "sync",
            roomId: currentRoomId,
            playerId: selfId,
            ...queue,
          }),
        });

        const rtt = Math.round(performance.now() - t0);
        if (mounted) setPingMs(rtt);

        if (res.ok) {
          const data = await res.json();
          if (mounted && data.ok && data.room) {
            setCurrentRoom((prev) => {
              if (!prev) return data.room;
              return {
                ...prev,
                ...data.room,
              };
            });
          }
        }
      } catch {
        /* network blip */
      } finally {
        inSyncRef.current = false;
      }
    }, intervalMs);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [currentRoomId, currentRoom?.status, selfId]);

  // Handle URL hash on initial load
  useEffect(() => {
    if (!autoJoinHash || typeof window === "undefined") return;
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.includes("room=")) {
        const match = hash.match(/room=([^&]+)/);
        if (match) {
          const code = decodeURIComponent(match[1]).trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
          if (code && (!roomRef.current || roomRef.current.id !== code)) {
            joinRoom(code).catch(() => {});
          }
        }
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [autoJoinHash, joinRoom]);

  return {
    selfId,
    rooms,
    currentRoom,
    isInRoom: Boolean(currentRoom),
    isHost,
    loading,
    error,
    pingMs,
    refreshRooms,
    createRoom,
    joinRoom,
    leaveRoom,
    updateSettings,
    toggleReady,
    updateProfile,
    startRace,
    returnToLobby,
    sendChat,
    queueSync,
  };
}

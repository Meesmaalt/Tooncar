import { z } from "zod";
import type { SpeedClass } from "@/types";

export interface RemoteRacerSyncState {
  id: string;
  x: number;
  y: number;
  z: number;
  rotY: number;
  speed: number;
  steerAngle?: number;
  isDrifting?: boolean;
  lap?: number;
  position?: number;
  checkpointIndex?: number;
  totalDistance?: number;
  turboTimer?: number;
  hasShield?: boolean;
  currentItem?: string | null;
  finished?: boolean;
  spinTimer?: number;
  frozenTimer?: number;
  starTimer?: number;
  trackT?: number;
  centerlineIndex?: number;
  inactiveBoxes?: number[];
  projectiles?: any[];
}

export interface ServerPlayer {
  id: string;
  name: string;
  carId: string;
  color: string;
  isHost: boolean;
  ready: boolean;
  lastSeen: number;
  state?: RemoteRacerSyncState;
  finishTime?: number | null;
  position?: number;
  lap?: number;
}

export interface ServerChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface ServerRoom {
  id: string;
  name: string;
  hostId: string;
  trackId: string;
  laps: number;
  speedClass: SpeedClass;
  status: "lobby" | "countdown" | "racing" | "finished";
  countdownStartTime?: number;
  raceStartTime?: number;
  maxPlayers: number;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
  players: Record<string, ServerPlayer>;
  projectiles: any[];
  inactiveBoxes: Record<number, number>; // boxIndex -> respawn timestamp
  combatEvents: { id: string; text: string; timestamp: number }[];
  chat: ServerChatMessage[];
  version: number;
}

export interface RoomSummary {
  id: string;
  name: string;
  hostName: string;
  trackId: string;
  laps: number;
  speedClass: SpeedClass;
  status: "lobby" | "countdown" | "racing" | "finished";
  playerCount: number;
  maxPlayers: number;
  isPublic: boolean;
  createdAt: number;
}

// Global server in-memory store for high-frequency multiplayer sync
interface GlobalRoomStore {
  rooms: Map<string, ServerRoom>;
  lastPrune: number;
}

const g = globalThis as typeof globalThis & {
  __tooncar_rooms_store__?: GlobalRoomStore;
};

if (!g.__tooncar_rooms_store__) {
  g.__tooncar_rooms_store__ = {
    rooms: new Map<string, ServerRoom>(),
    lastPrune: Date.now(),
  };
}

const store = g.__tooncar_rooms_store__!;

const ROOM_ID_REGEX = /^[a-z0-9_-]{2,32}$/;
const PLAYER_TIMEOUT_MS = 20_000;
const ROOM_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function pruneOldRoomsAndPlayers() {
  const now = Date.now();
  if (now - store.lastPrune < 5000) return;
  store.lastPrune = now;

  for (const [roomId, room] of store.rooms.entries()) {
    // Check inactive players
    for (const [playerId, player] of Object.entries(room.players)) {
      if (now - player.lastSeen > PLAYER_TIMEOUT_MS) {
        delete room.players[playerId];
        room.version++;
        room.updatedAt = now;
        room.combatEvents.push({
          id: `dc-${now}-${playerId}`,
          text: `👋 ${player.name} lahkus toast.`,
          timestamp: now,
        });

        // Migrate host if host left
        if (player.isHost) {
          const remaining = Object.values(room.players);
          if (remaining.length > 0) {
            remaining[0].isHost = true;
            room.hostId = remaining[0].id;
            room.combatEvents.push({
              id: `host-${now}`,
              text: `👑 Uus toa peremees on ${remaining[0].name}!`,
              timestamp: now,
            });
          }
        }
      }
    }

    // If room is empty or ancient, delete it
    if (Object.keys(room.players).length === 0 || now - room.createdAt > ROOM_TIMEOUT_MS) {
      store.rooms.delete(roomId);
    }
  }
}

export const RoomManager = {
  listRooms(): RoomSummary[] {
    pruneOldRoomsAndPlayers();
    const result: RoomSummary[] = [];
    for (const room of store.rooms.values()) {
      if (!room.isPublic && room.status !== "lobby") continue;
      const host = room.players[room.hostId];
      result.push({
        id: room.id,
        name: room.name,
        hostName: host ? host.name : "Peremees",
        trackId: room.trackId,
        laps: room.laps,
        speedClass: room.speedClass,
        status: room.status,
        playerCount: Object.keys(room.players).length,
        maxPlayers: room.maxPlayers,
        isPublic: room.isPublic,
        createdAt: room.createdAt,
      });
    }
    // Return newest first
    return result.sort((a, b) => b.createdAt - a.createdAt);
  },

  getRoom(roomId: string): ServerRoom | null {
    pruneOldRoomsAndPlayers();
    return store.rooms.get(roomId) || null;
  },

  createRoom(params: {
    id?: string;
    name: string;
    trackId: string;
    laps: number;
    speedClass: SpeedClass;
    maxPlayers?: number;
    isPublic?: boolean;
    creator: {
      id: string;
      name: string;
      carId: string;
      color: string;
    };
  }): ServerRoom {
    pruneOldRoomsAndPlayers();
    const now = Date.now();
    let id = (params.id || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!id || !ROOM_ID_REGEX.test(id)) {
      id = `gp-${Math.random().toString(36).substring(2, 7)}`;
    }

    const room: ServerRoom = {
      id,
      name: params.name.trim().slice(0, 32) || `Tuba ${id}`,
      hostId: params.creator.id,
      trackId: params.trackId || "sunny_beach",
      laps: Math.max(1, Math.min(params.laps || 3, 7)),
      speedClass: params.speedClass || "100cc",
      status: "lobby",
      maxPlayers: Math.max(2, Math.min(params.maxPlayers || 6, 8)),
      isPublic: params.isPublic !== false,
      createdAt: now,
      updatedAt: now,
      players: {
        [params.creator.id]: {
          id: params.creator.id,
          name: params.creator.name.slice(0, 18) || "Sõitja 1",
          carId: params.creator.carId || "speedy_turbo",
          color: params.creator.color || "#ef4444",
          isHost: true,
          ready: true,
          lastSeen: now,
        },
      },
      projectiles: [],
      inactiveBoxes: {},
      combatEvents: [
        {
          id: `create-${now}`,
          text: `🏁 Tuba "${params.name}" loodi!`,
          timestamp: now,
        },
      ],
      chat: [
        {
          id: `welcome-${now}`,
          senderId: "system",
          senderName: "ToonCar GP",
          text: `Tere tulemast tuppa "${params.name}"!`,
          timestamp: now,
        },
      ],
      version: 1,
    };

    store.rooms.set(id, room);
    return room;
  },

  joinRoom(roomId: string, player: {
    id: string;
    name: string;
    carId: string;
    color: string;
  }): ServerRoom {
    pruneOldRoomsAndPlayers();
    const room = store.rooms.get(roomId);
    if (!room) {
      throw new Error("Tuba ei leitud!");
    }

    const now = Date.now();
    const existingPlayer = room.players[player.id];
    const isRoomFull = Object.keys(room.players).length >= room.maxPlayers && !existingPlayer;

    if (isRoomFull) {
      throw new Error("Tuba on täis!");
    }

    const isHost = existingPlayer ? existingPlayer.isHost : Object.keys(room.players).length === 0;

    room.players[player.id] = {
      id: player.id,
      name: player.name.slice(0, 18) || "Sõitja",
      carId: player.carId || "speedy_turbo",
      color: player.color || "#3b82f6",
      isHost,
      ready: isHost ? true : false,
      lastSeen: now,
    };

    if (!existingPlayer) {
      room.combatEvents.push({
        id: `join-${now}-${player.id}`,
        text: `🚗 ${player.name} liitus toaga!`,
        timestamp: now,
      });
      room.chat.push({
        id: `chat-join-${now}`,
        senderId: "system",
        senderName: "Süsteem",
        text: `${player.name} liitus toaga!`,
        timestamp: now,
      });
    }

    room.version++;
    room.updatedAt = now;
    return room;
  },

  leaveRoom(roomId: string, playerId: string): boolean {
    const room = store.rooms.get(roomId);
    if (!room) return false;

    const player = room.players[playerId];
    if (!player) return false;

    const now = Date.now();
    delete room.players[playerId];
    room.version++;
    room.updatedAt = now;

    const remaining = Object.values(room.players);
    if (remaining.length === 0) {
      store.rooms.delete(roomId);
      return true;
    }

    if (player.isHost) {
      remaining[0].isHost = true;
      room.hostId = remaining[0].id;
      room.combatEvents.push({
        id: `host-${now}`,
        text: `👑 Uus toa peremees on ${remaining[0].name}!`,
        timestamp: now,
      });
    }

    return true;
  },

  updateSettings(roomId: string, hostId: string, settings: {
    name?: string;
    trackId?: string;
    laps?: number;
    speedClass?: SpeedClass;
  }): ServerRoom {
    const room = store.rooms.get(roomId);
    if (!room) throw new Error("Tuba ei leitud!");
    if (room.hostId !== hostId) throw new Error("Ainult toa peremees saab seadeid muuta!");

    if (settings.name) room.name = settings.name.trim().slice(0, 32);
    if (settings.trackId) room.trackId = settings.trackId;
    if (settings.laps) room.laps = Math.max(1, Math.min(settings.laps, 7));
    if (settings.speedClass) room.speedClass = settings.speedClass;

    room.version++;
    room.updatedAt = Date.now();
    return room;
  },

  toggleReady(roomId: string, playerId: string, ready?: boolean): ServerRoom {
    const room = store.rooms.get(roomId);
    if (!room) throw new Error("Tuba ei leitud!");
    const player = room.players[playerId];
    if (!player) throw new Error("Mängijat ei leitud!");

    player.ready = ready !== undefined ? ready : !player.ready;
    player.lastSeen = Date.now();
    room.version++;
    room.updatedAt = Date.now();
    return room;
  },

  updateProfile(roomId: string, playerId: string, profile: {
    name?: string;
    carId?: string;
    color?: string;
  }): ServerRoom {
    const room = store.rooms.get(roomId);
    if (!room) throw new Error("Tuba ei leitud!");
    const player = room.players[playerId];
    if (!player) throw new Error("Mängijat ei leitud!");

    if (profile.name) player.name = profile.name.slice(0, 18);
    if (profile.carId) player.carId = profile.carId;
    if (profile.color) player.color = profile.color;
    player.lastSeen = Date.now();

    room.version++;
    room.updatedAt = Date.now();
    return room;
  },

  startRace(roomId: string, hostId: string): ServerRoom {
    const room = store.rooms.get(roomId);
    if (!room) throw new Error("Tuba ei leitud!");
    if (room.hostId !== hostId) throw new Error("Ainult toa peremees saab võistlust alustada!");

    const now = Date.now();
    room.status = "countdown";
    room.countdownStartTime = now;
    room.raceStartTime = now + 3500;
    room.projectiles = [];
    room.inactiveBoxes = {};
    room.combatEvents = [
      {
        id: `start-${now}`,
        text: `🚦 VÕISTLUS ALGAS!`,
        timestamp: now,
      },
    ];

    // Reset finish times and positions
    for (const p of Object.values(room.players)) {
      p.finishTime = null;
      p.state = undefined;
    }

    room.version++;
    room.updatedAt = now;
    return room;
  },

  returnToLobby(roomId: string, hostId: string): ServerRoom {
    const room = store.rooms.get(roomId);
    if (!room) throw new Error("Tuba ei leitud!");
    if (room.hostId !== hostId) throw new Error("Ainult toa peremees saab naasta fuajeesse!");

    const now = Date.now();
    room.status = "lobby";
    room.projectiles = [];
    room.inactiveBoxes = {};
    for (const p of Object.values(room.players)) {
      p.finishTime = null;
      p.state = undefined;
      p.ready = p.isHost;
    }

    room.version++;
    room.updatedAt = now;
    return room;
  },

  sendChat(roomId: string, playerId: string, text: string): ServerChatMessage {
    const room = store.rooms.get(roomId);
    if (!room) throw new Error("Tuba ei leitud!");
    const player = room.players[playerId];
    const name = player ? player.name : "Sõitja";

    const msg: ServerChatMessage = {
      id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      senderId: playerId,
      senderName: name,
      text: text.trim().slice(0, 120),
      timestamp: Date.now(),
    };

    room.chat.push(msg);
    if (room.chat.length > 50) room.chat.shift();
    room.version++;
    room.updatedAt = Date.now();
    return msg;
  },

  sync(params: {
    roomId: string;
    playerId: string;
    state?: RemoteRacerSyncState;
    newProjectiles?: any[];
    takenBox?: { index: number; timestamp?: number };
    hit?: { type: string; targetId: string; x: number; y: number; z: number };
    finishTime?: number;
  }): {
    room: {
      id: string;
      status: string;
      version: number;
      trackId: string;
      laps: number;
      speedClass: SpeedClass;
      countdownStartTime?: number;
      raceStartTime?: number;
      players: Record<string, ServerPlayer>;
      projectiles: any[];
      inactiveBoxes: number[];
      combatEvents: { id: string; text: string; timestamp: number }[];
      chat: ServerChatMessage[];
    };
  } {
    const room = store.rooms.get(params.roomId);
    if (!room) throw new Error("Tuba ei leitud!");

    const now = Date.now();
    const player = room.players[params.playerId];
    if (player) {
      player.lastSeen = now;
      if (params.state) {
        player.state = params.state;
        if (params.state.lap != null) player.lap = params.state.lap;
        if (params.state.position != null) player.position = params.state.position;
      }
      if (params.finishTime != null && player.finishTime == null) {
        player.finishTime = params.finishTime;
        room.combatEvents.push({
          id: `fin-${now}-${player.id}`,
          text: `🏁 ${player.name} finišeerus ajaga ${params.finishTime.toFixed(2)}s!`,
          timestamp: now,
        });
        // Check if all players finished
        const allFinished = Object.values(room.players).every((p) => p.finishTime != null);
        if (allFinished) {
          room.status = "finished";
        }
      }
    }

    // Auto-advance countdown to racing when timer expires
    if (room.status === "countdown" && room.raceStartTime && now >= room.raceStartTime) {
      room.status = "racing";
      room.version++;
    }

    // Process new projectiles
    if (params.newProjectiles && params.newProjectiles.length > 0) {
      for (const p of params.newProjectiles) {
        if (!room.projectiles.some((existing) => existing.id === p.id)) {
          room.projectiles.push(p);
        }
      }
      room.version++;
    }

    // Remove expired projectiles
    room.projectiles = room.projectiles.filter((p) => {
      p.life = (p.life ?? 8) - 0.05;
      return p.life > 0 && p.active !== false;
    });

    // Process taken box
    if (params.takenBox && typeof params.takenBox.index === "number") {
      room.inactiveBoxes[params.takenBox.index] = now + 6500;
      room.version++;
    }

    // Check respawn of boxes
    const activeInactiveBoxes: number[] = [];
    for (const [idxStr, respawnTime] of Object.entries(room.inactiveBoxes)) {
      const idx = Number(idxStr);
      if (now < respawnTime) {
        activeInactiveBoxes.push(idx);
      } else {
        delete room.inactiveBoxes[idx];
      }
    }

    // Process hit event
    if (params.hit) {
      const target = room.players[params.hit.targetId];
      const targetName = target ? target.name : "Vastane";
      const attacker = player ? player.name : "Mängija";
      room.combatEvents.push({
        id: `hit-${now}-${Math.random().toString(36).slice(2, 6)}`,
        text: `💥 ${attacker} tabas sõitjat: ${targetName}!`,
        timestamp: now,
      });
      room.version++;
    }

    // Keep events trimmed
    if (room.combatEvents.length > 25) {
      room.combatEvents = room.combatEvents.slice(-25);
    }

    return {
      room: {
        id: room.id,
        status: room.status,
        version: room.version,
        trackId: room.trackId,
        laps: room.laps,
        speedClass: room.speedClass,
        countdownStartTime: room.countdownStartTime,
        raceStartTime: room.raceStartTime,
        players: room.players,
        projectiles: room.projectiles,
        inactiveBoxes: activeInactiveBoxes,
        combatEvents: room.combatEvents.slice(-10),
        chat: room.chat.slice(-20),
      },
    };
  },
};

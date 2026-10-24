import { createFileRoute } from "@tanstack/react-router";
import { RoomManager } from "@/lib/multiplayer/room.server";

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store, no-cache, must-revalidate",
    },
  });
}

const handleGet = async ({ request }: { request: Request }) => {
  try {
    const url = new URL(request.url);
    const roomId = url.searchParams.get("room");

    if (roomId) {
      const room = RoomManager.getRoom(roomId);
      if (!room) {
        return jsonResponse({ ok: false, error: "Tuba ei leitud", room: null }, 200);
      }
      return jsonResponse({ ok: true, room });
    }

    const rooms = RoomManager.listRooms();
    return jsonResponse({ ok: true, rooms });
  } catch (err: any) {
    return jsonResponse({ ok: false, error: err?.message || "Serveri viga" }, 200);
  }
};

const handlePost = async ({ request }: { request: Request }) => {
  try {
    const body = await request.json();
    const action = body?.action;

    switch (action) {
      case "create": {
        const room = RoomManager.createRoom({
          id: body.id,
          name: body.name,
          trackId: body.trackId,
          laps: body.laps,
          speedClass: body.speedClass,
          maxPlayers: body.maxPlayers,
          isPublic: body.isPublic,
          creator: body.creator,
        });
        return jsonResponse({ ok: true, room });
      }

      case "join": {
        const room = RoomManager.joinRoom(body.roomId, body.player);
        return jsonResponse({ ok: true, room });
      }

      case "leave": {
        const ok = RoomManager.leaveRoom(body.roomId, body.playerId);
        return jsonResponse({ ok });
      }

      case "update_settings": {
        const room = RoomManager.updateSettings(body.roomId, body.hostId, body.settings);
        return jsonResponse({ ok: true, room });
      }

      case "toggle_ready": {
        const room = RoomManager.toggleReady(body.roomId, body.playerId, body.ready);
        return jsonResponse({ ok: true, room });
      }

      case "update_profile": {
        const room = RoomManager.updateProfile(body.roomId, body.playerId, body.profile);
        return jsonResponse({ ok: true, room });
      }

      case "start_race": {
        const room = RoomManager.startRace(body.roomId, body.hostId);
        return jsonResponse({ ok: true, room });
      }

      case "return_lobby": {
        const room = RoomManager.returnToLobby(body.roomId, body.hostId);
        return jsonResponse({ ok: true, room });
      }

      case "chat": {
        const msg = RoomManager.sendChat(body.roomId, body.playerId, body.text);
        return jsonResponse({ ok: true, message: msg });
      }

      case "sync": {
        const result = RoomManager.sync({
          roomId: body.roomId,
          playerId: body.playerId,
          state: body.state,
          newProjectiles: body.newProjectiles,
          takenBox: body.takenBox,
          hit: body.hit,
          finishTime: body.finishTime,
        });
        return jsonResponse({ ok: true, ...result });
      }

      default:
        return jsonResponse({ ok: false, error: `Tundmatu tegevus: ${action}` }, 200);
    }
  } catch (err: any) {
    return jsonResponse({ ok: false, error: err?.message || "Serveri viga" }, 200);
  }
};

export const Route = createFileRoute("/api/rooms")({
  server: {
    handlers: {
      GET: handleGet,
      POST: handlePost,
    },
  },
});

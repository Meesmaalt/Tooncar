import { useState } from "react";
import {
  Check,
  ChevronRight,
  Copy,
  Crown,
  Dice5,
  Flag,
  Globe,
  Lock,
  MessageSquare,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { TRACK_DEFINITIONS } from "@/game/tracks";
import { CAR_DEFINITIONS } from "@/game/cars";
import type { SpeedClass } from "@/types";
import type { ServerRoom, RoomSummary } from "@/lib/multiplayer";

interface Props {
  playerName: string;
  selectedCarId: string;
  selectedColor: string;
  selfId: string;
  rooms: RoomSummary[];
  currentRoom: ServerRoom | null;
  loading: boolean;
  error: string | null;
  pingMs: number | null;
  onRefreshRooms: () => void;
  onCreateRoom: (params: {
    id?: string;
    name: string;
    trackId: string;
    laps: number;
    speedClass: SpeedClass;
    maxPlayers?: number;
    isPublic?: boolean;
  }) => Promise<ServerRoom>;
  onJoinRoom: (roomId: string) => Promise<ServerRoom>;
  onLeaveRoom: () => void;
  onUpdateSettings: (settings: { trackId?: string; laps?: number; speedClass?: SpeedClass; name?: string }) => void;
  onToggleReady: (ready?: boolean) => void;
  onStartRace: () => void;
  onSendChat: (text: string) => void;
  onBackToMenu: () => void;
}

const FUN_ROOM_NAMES = [
  "Põhjamaa Kiirteed",
  "Turbomõmmide Ralli",
  "Välk ja Pauk GP",
  "Päikeseranna Meistrid",
  "Öised Kummitused",
  "Küberkrahhid",
  "Laavajõgede Ässad",
  "Kosmiline Triiviklubi",
  "Nitro ja Šampus",
];

function getTrackImage(trackId: string): string {
  return `/tracks/${trackId}.jpg`;
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fallback */
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function MultiplayerHub({
  playerName,
  selectedCarId,
  selectedColor,
  selfId,
  rooms,
  currentRoom,
  loading,
  error,
  pingMs,
  onRefreshRooms,
  onCreateRoom,
  onJoinRoom,
  onLeaveRoom,
  onUpdateSettings,
  onToggleReady,
  onStartRace,
  onSendChat,
  onBackToMenu,
}: Props) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [directCode, setDirectCode] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [chatInput, setChatInput] = useState("");

  // Create room modal form state
  const [newRoomName, setNewRoomName] = useState(() => FUN_ROOM_NAMES[Math.floor(Math.random() * FUN_ROOM_NAMES.length)]);
  const [newRoomCode, setNewRoomCode] = useState("");
  const [newTrackId, setNewTrackId] = useState("sunny_beach");
  const [newLaps, setNewLaps] = useState<number>(3);
  const [newSpeedClass, setNewSpeedClass] = useState<SpeedClass>("100cc");
  const [newMaxPlayers, setNewMaxPlayers] = useState<number>(6);
  const [newIsPublic, setNewIsPublic] = useState(true);

  const isHost = Boolean(currentRoom && currentRoom.hostId === selfId);
  const myPlayer = currentRoom ? currentRoom.players[selfId] : null;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateRoom({
        id: newRoomCode.trim() ? newRoomCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "") : undefined,
        name: newRoomName.trim() || "ToonCar GP Tuba",
        trackId: newTrackId,
        laps: newLaps,
        speedClass: newSpeedClass,
        maxPlayers: newMaxPlayers,
        isPublic: newIsPublic,
      });
      setShowCreateModal(false);
    } catch {
      /* handled in hook */
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChat(chatInput.trim());
    setChatInput("");
  };

  const sendQuickShout = (shout: string) => {
    onSendChat(shout);
  };

  // ROOM LOBBY (When user is inside a room)
  if (currentRoom) {
    const currentTrack = TRACK_DEFINITIONS.find((t) => t.id === currentRoom.trackId) || TRACK_DEFINITIONS[0];
    const playerList = Object.values(currentRoom.players);
    const allReady = playerList.length >= 1 && playerList.every((p) => p.ready || p.isHost);
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}#room=${encodeURIComponent(currentRoom.id)}` : "";

    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
        {/* Room Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface/95 p-4 sm:p-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex size-2.5 rounded-full bg-ok animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Serveripõhine tuba</span>
              <span className="rounded bg-line px-2 py-0.5 font-mono text-xs text-muted">#{currentRoom.id}</span>
              {pingMs != null && <span className="font-mono text-xs text-ok">({pingMs}ms)</span>}
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-fg">{currentRoom.name}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                const ok = await copyToClipboard(shareUrl);
                setCopiedLink(ok);
                setTimeout(() => setCopiedLink(false), 2500);
              }}
              className="flex h-9 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-xs font-medium text-fg hover:bg-surface/80 transition-colors"
            >
              {copiedLink ? <Check className="size-3.5 text-ok" /> : <Copy className="size-3.5" />}
              {copiedLink ? "Otselink kopeeritud!" : "Kopeeri otselink"}
            </button>
            <button
              type="button"
              onClick={async () => {
                const ok = await copyToClipboard(currentRoom.id);
                setCopiedCode(ok);
                setTimeout(() => setCopiedCode(false), 2500);
              }}
              className="flex h-9 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-xs font-medium text-fg hover:bg-surface/80 transition-colors"
            >
              {copiedCode ? <Check className="size-3.5 text-ok" /> : <Copy className="size-3.5" />}
              {copiedCode ? "Kood kopeeritud!" : "Kopeeri kood"}
            </button>
            <button
              type="button"
              onClick={onLeaveRoom}
              className="h-9 rounded-md border border-line px-3 text-xs text-muted hover:text-fg hover:bg-surface/80 transition-colors"
            >
              Lahku toast
            </button>
          </div>
        </div>

        {/* Share Link Banner */}
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line/70 bg-surface/70 px-4 py-2.5 text-xs text-muted">
          <span className="font-medium text-fg">Jaga sõbrale:</span>
          <input
            readOnly
            value={shareUrl}
            onClick={(e) => (e.target as HTMLInputElement).select()}
            className="h-7 flex-1 min-w-[200px] rounded border border-line bg-bg px-2 font-mono text-[11px] text-muted select-all"
            title="Klõpsa lingi märgistamiseks ja kopeerimiseks"
          />
          <span className="text-faint">Sõber avab lingi ja ühineb kohe samasse tuppa!</span>
        </div>

        {/* Main Grid: Track & Settings (Left) + Racers (Right) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Track Selection & Settings */}
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-xl border border-line bg-surface/90 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-faint">Võistlusrada</span>
                {isHost && <span className="text-[11px] text-accent">Host saab vahetada</span>}
              </div>

              <div className="overflow-hidden rounded-lg border border-line bg-bg">
                <div
                  className="h-28 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${getTrackImage(currentTrack.id)})` }}
                />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-fg">{currentTrack.name.split(" (")[0]}</h3>
                    <span className="rounded bg-line px-2 py-0.5 text-[10px] uppercase font-bold text-muted">
                      {currentTrack.difficulty}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{currentTrack.description}</p>
                </div>
              </div>

              {/* Host track changer */}
              {isHost ? (
                <div className="space-y-3 pt-2 border-t border-line/60">
                  <label className="block text-xs text-muted">
                    <span className="block mb-1 font-medium text-fg">Vali teine rada:</span>
                    <select
                      value={currentRoom.trackId}
                      onChange={(e) => onUpdateSettings({ trackId: e.target.value })}
                      className="h-9 w-full rounded border border-line bg-surface px-2.5 text-xs text-fg"
                    >
                      {TRACK_DEFINITIONS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name.split(" (")[0]} ({(t.lengthMeters / 1000).toFixed(1)} km)
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="flex gap-2">
                    <label className="flex-1 text-xs text-muted">
                      <span className="block mb-1 font-medium text-fg">Ringid:</span>
                      <select
                        value={currentRoom.laps}
                        onChange={(e) => onUpdateSettings({ laps: Number(e.target.value) })}
                        className="h-9 w-full rounded border border-line bg-surface px-2 text-xs text-fg"
                      >
                        <option value={1}>1 ring (Sprint)</option>
                        <option value={3}>3 ringi (Klassikaline)</option>
                        <option value={5}>5 ringi (Pikk sõit)</option>
                        <option value={7}>7 ringi (Grand Prix)</option>
                      </select>
                    </label>

                    <label className="flex-1 text-xs text-muted">
                      <span className="block mb-1 font-medium text-fg">Kiirus:</span>
                      <select
                        value={currentRoom.speedClass}
                        onChange={(e) => onUpdateSettings({ speedClass: e.target.value as SpeedClass })}
                        className="h-9 w-full rounded border border-line bg-surface px-2 text-xs text-fg"
                      >
                        <option value="50cc">50cc (Rahulik)</option>
                        <option value="100cc">100cc (Tavaline)</option>
                        <option value="150cc">150cc (Ekstreemne)</option>
                      </select>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded bg-surface/60 px-3 py-2 text-xs text-muted">
                  <span>Ringid: <strong className="text-fg">{currentRoom.laps}</strong></span>
                  <span>Kiirusklass: <strong className="text-fg">{currentRoom.speedClass}</strong></span>
                  <span>Maks. sõitjaid: <strong className="text-fg">{currentRoom.maxPlayers}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Racers & Ready Action */}
          <div className="space-y-4 lg:col-span-7">
            <div className="rounded-xl border border-line bg-surface/90 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-accent" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-faint">
                    Toas olevad sõitjad ({playerList.length} / {currentRoom.maxPlayers})
                  </span>
                </div>
                {allReady && <span className="text-xs text-ok font-medium">Kõik valmis!</span>}
              </div>

              {/* Player Cards */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {playerList.map((p) => {
                  const car = CAR_DEFINITIONS.find((c) => c.id === p.carId) || CAR_DEFINITIONS[0];
                  const isMe = p.id === selfId;
                  return (
                    <div
                      key={p.id}
                      className={`relative flex items-center gap-3 rounded-lg border p-3 transition-all ${
                        p.ready || p.isHost
                          ? "border-ok/40 bg-surface/95"
                          : "border-line bg-surface/60"
                      } ${isMe ? "ring-1 ring-accent" : ""}`}
                    >
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line shadow-inner"
                        style={{ backgroundColor: p.color }}
                      >
                        <span className="font-display font-bold text-sm text-white drop-shadow">
                          {p.name.charAt(0).toUpperCase()}
                        </span>
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-semibold text-sm text-fg">
                            {p.name} {isMe && "(Sina)"}
                          </span>
                          {p.isHost && (
                            <span title="Toa peremees">
                              <Crown className="size-3.5 text-warn shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="truncate text-xs text-muted">{car.name}</div>
                      </div>

                      <div className="shrink-0">
                        {p.isHost ? (
                          <span className="rounded bg-warn/15 px-2 py-0.5 text-[10px] font-semibold text-warn">
                            Peremees
                          </span>
                        ) : p.ready ? (
                          <span className="flex items-center gap-1 rounded bg-ok/15 px-2 py-0.5 text-[10px] font-semibold text-ok">
                            <Check className="size-3" /> Valmis
                          </span>
                        ) : (
                          <span className="rounded bg-muted/20 px-2 py-0.5 text-[10px] font-medium text-muted">
                            Ootel
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ready / Start Race Actions */}
              <div className="pt-2 border-t border-line/60 flex flex-wrap items-center justify-between gap-3">
                {!isHost && myPlayer && (
                  <button
                    type="button"
                    onClick={() => onToggleReady()}
                    className={`flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold transition-all ${
                      myPlayer.ready
                        ? "bg-line text-fg hover:bg-line/80"
                        : "bg-ok text-white hover:bg-ok/90"
                    }`}
                  >
                    <Check className="size-4" />
                    {myPlayer.ready ? "Tühista valmisolek" : "Olen valmis sõiduks!"}
                  </button>
                )}

                {isHost && (
                  <button
                    type="button"
                    onClick={onStartRace}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-accent text-base font-semibold text-accent-fg hover:opacity-95 transition-opacity shadow-lg shadow-accent/20"
                  >
                    <Flag className="size-5" />
                    Alusta võistlust ({playerList.length} sõitja{playerList.length === 1 ? "" : "ga"})
                  </button>
                )}
              </div>
            </div>

            {/* In-Lobby Chat & Quick Emotes */}
            <div className="rounded-xl border border-line bg-surface/90 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-3.5 text-accent" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-faint">Toa vestlus & hüüded</span>
                </div>
              </div>

              {/* Quick emote shouts */}
              <div className="flex flex-wrap gap-1.5">
                {["👋 Tere!", "🔥 Valmis!", "🏎️ Teeme ära!", "🚀 Täisgaas!", "⏱️ Oota veidi!", "🏆 Näeme finišis!"].map(
                  (shout) => (
                    <button
                      key={shout}
                      type="button"
                      onClick={() => sendQuickShout(shout)}
                      className="rounded border border-line bg-surface px-2.5 py-1 text-xs text-fg hover:bg-raised transition-colors"
                    >
                      {shout}
                    </button>
                  ),
                )}
              </div>

              {/* Chat message box */}
              <div className="h-28 overflow-y-auto rounded border border-line/70 bg-bg/80 p-2 text-xs space-y-1 font-sans">
                {currentRoom.chat.length === 0 ? (
                  <div className="text-muted/60 text-center py-4">Tervita teisi sõitjaid!</div>
                ) : (
                  currentRoom.chat.map((msg) => (
                    <div key={msg.id} className="flex gap-1.5 leading-relaxed">
                      <span className={`font-semibold shrink-0 ${msg.senderId === "system" ? "text-accent" : "text-fg"}`}>
                        {msg.senderName}:
                      </span>
                      <span className="text-muted break-words">{msg.text}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Chat input */}
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Kirjuta sõnum toale..."
                  maxLength={100}
                  className="h-9 flex-1 rounded border border-line bg-surface px-3 text-xs text-fg placeholder:text-muted"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="flex h-9 items-center justify-center rounded bg-accent px-3 text-xs text-accent-fg disabled:opacity-50"
                >
                  <Send className="size-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ROOM BROWSER & LOBBY DISCOVERY (When not in a room)
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface/95 p-4 sm:p-5">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Serveripõhine mitmikmäng</span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-fg">Tubade fuajee</h2>
          <p className="text-xs text-muted mt-0.5">Liitu teiste mängijate toaga või loo enda kohandatud võistlustuba.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefreshRooms}
            disabled={loading}
            className="flex h-10 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-xs font-medium text-fg hover:bg-surface/80 transition-colors"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Värskenda
          </button>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex h-10 items-center gap-1.5 rounded-md bg-accent px-4 text-xs font-semibold text-accent-fg hover:opacity-95 transition-opacity"
          >
            <Plus className="size-4" /> Loo uus tuba
          </button>
          <button
            type="button"
            onClick={onBackToMenu}
            className="h-10 rounded-md border border-line px-3 text-xs text-muted hover:text-fg"
          >
            Tagasi peamenüüsse
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Quick Join By Room Code */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface/90 p-4">
        <span className="text-xs font-medium text-fg">Otseliitumine toakoodiga:</span>
        <div className="flex flex-1 min-w-[200px] gap-2">
          <input
            value={directCode}
            onChange={(e) => setDirectCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
            placeholder="nt. gp-tuba või sõbra kood..."
            className="h-10 flex-1 rounded-md border border-line bg-bg px-3 text-xs font-mono text-fg placeholder:text-muted"
          />
          <button
            type="button"
            disabled={!directCode.trim()}
            onClick={() => onJoinRoom(directCode.trim())}
            className="flex h-10 items-center gap-1.5 rounded-md bg-accent px-4 text-xs font-medium text-accent-fg disabled:opacity-40"
          >
            Liitu toaga <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Public Rooms List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-faint uppercase tracking-wider px-1">
          <span>Aktiivsed toad ({rooms.length})</span>
          <span>Klõpsa liitumiseks</span>
        </div>

        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface/40 py-12 text-center p-6 space-y-3">
            <Users className="size-10 text-muted/40" />
            <h3 className="font-semibold text-fg text-sm">Ühtegi avalikku tuba pole hetkel aktiivne</h3>
            <p className="max-w-xs text-xs text-muted">
              Ole esimene! Loo uus võistlustuba, kutsu oma sõbrad lingi abil ja kihutage koos!
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-2 flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-xs font-medium text-accent-fg"
            >
              <Plus className="size-4" /> Loo esimene tuba
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => {
              const track = TRACK_DEFINITIONS.find((t) => t.id === room.trackId) || TRACK_DEFINITIONS[0];
              const isFull = room.playerCount >= room.maxPlayers;
              const isRacing = room.status === "racing" || room.status === "countdown";

              return (
                <div
                  key={room.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-line bg-surface/90 hover:border-accent/60 transition-all hover:shadow-md"
                >
                  <div
                    className="h-24 w-full bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${getTrackImage(track.id)})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur">
                        #{room.id}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold backdrop-blur ${
                          isRacing
                            ? "bg-amber-500/80 text-white"
                            : isFull
                            ? "bg-red-500/80 text-white"
                            : "bg-emerald-600/80 text-white"
                        }`}
                      >
                        {isRacing ? "Sõit käib" : isFull ? "Tuba täis" : "Ootab mängijaid"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-3">
                    <div>
                      <h4 className="font-semibold text-base text-fg group-hover:text-accent transition-colors truncate">
                        {room.name}
                      </h4>
                      <p className="text-xs text-muted truncate">
                        {track.name.split(" (")[0]} · {room.laps} ringi · {room.speedClass}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted border-t border-line/60 pt-2.5">
                      <div className="flex items-center gap-1">
                        <Users className="size-3.5 text-accent" />
                        <span className="font-semibold text-fg">
                          {room.playerCount} / {room.maxPlayers}
                        </span>
                      </div>
                      <span className="text-faint truncate max-w-[120px]">👑 {room.hostName}</span>
                    </div>

                    <button
                      type="button"
                      disabled={isFull}
                      onClick={() => onJoinRoom(room.id)}
                      className={`flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isFull
                          ? "bg-line/40 text-muted cursor-not-allowed"
                          : "bg-accent text-accent-fg hover:opacity-90"
                      }`}
                    >
                      {isFull ? "Tuba on täis" : "Liitu võistlusega"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE ROOM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-accent" />
                <h3 className="font-display text-xl font-bold text-fg">Loo uus võistlustuba</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded p-1 text-muted hover:text-fg"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <label className="block">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-fg">Toa nimi:</span>
                  <button
                    type="button"
                    onClick={() => setNewRoomName(FUN_ROOM_NAMES[Math.floor(Math.random() * FUN_ROOM_NAMES.length)])}
                    className="flex items-center gap-1 text-[11px] text-accent hover:underline"
                  >
                    <Dice5 className="size-3" /> Juhuslik nimi
                  </button>
                </div>
                <input
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value.slice(0, 32))}
                  required
                  placeholder="nt. Reedeõhtune Grand Prix"
                  className="h-10 w-full rounded-md border border-line bg-bg px-3 text-xs text-fg"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-fg">Toa kood (valikuline otselingi jaoks):</span>
                <input
                  value={newRoomCode}
                  onChange={(e) => setNewRoomCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 16))}
                  placeholder="nt. tiim-alpha (kui tühjaks jätta, luuakse automaatselt)"
                  className="h-10 w-full rounded-md border border-line bg-bg px-3 text-xs font-mono text-fg"
                />
              </label>

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-fg">Vali rada:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TRACK_DEFINITIONS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewTrackId(t.id)}
                      className={`relative overflow-hidden rounded-lg border text-left p-2 transition-all ${
                        newTrackId === t.id
                          ? "border-accent ring-2 ring-accent/30 bg-accent/10"
                          : "border-line bg-bg/80 hover:border-line/80"
                      }`}
                    >
                      <div
                        className="h-14 w-full rounded bg-cover bg-center mb-1.5"
                        style={{ backgroundImage: `url(${getTrackImage(t.id)})` }}
                      />
                      <div className="font-semibold text-[11px] truncate text-fg">{t.name.split(" (")[0]}</div>
                      <div className="text-[10px] text-muted">{(t.lengthMeters / 1000).toFixed(1)} km</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs">
                  <span className="mb-1 block font-medium text-fg">Ringide arv:</span>
                  <select
                    value={newLaps}
                    onChange={(e) => setNewLaps(Number(e.target.value))}
                    className="h-10 w-full rounded-md border border-line bg-bg px-3 text-xs text-fg"
                  >
                    <option value={1}>1 ring (Sprint)</option>
                    <option value={3}>3 ringi (Tavaline)</option>
                    <option value={5}>5 ringi (Pikk)</option>
                    <option value={7}>7 ringi (Grand Prix)</option>
                  </select>
                </label>

                <label className="block text-xs">
                  <span className="mb-1 block font-medium text-fg">Kiirusklass:</span>
                  <select
                    value={newSpeedClass}
                    onChange={(e) => setNewSpeedClass(e.target.value as SpeedClass)}
                    className="h-10 w-full rounded-md border border-line bg-bg px-3 text-xs text-fg"
                  >
                    <option value="50cc">50cc (Algajad)</option>
                    <option value="100cc">100cc (Klassikaline)</option>
                    <option value="150cc">150cc (Kiire ja metsik)</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-line bg-bg p-3 text-xs">
                <div>
                  <div className="font-medium text-fg">Avalik tuba</div>
                  <div className="text-muted text-[11px]">Kuvatakse tubade nimekirjas kõigile mängijatele</div>
                </div>
                <input
                  type="checkbox"
                  checked={newIsPublic}
                  onChange={(e) => setNewIsPublic(e.target.checked)}
                  className="size-4 accent-accent"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="h-10 rounded-md border border-line px-4 text-xs text-muted hover:text-fg"
                >
                  Loobu
                </button>
                <button
                  type="submit"
                  className="flex h-10 items-center gap-1.5 rounded-md bg-accent px-5 text-xs font-semibold text-accent-fg"
                >
                  <Plus className="size-4" /> Loo ja sisene tuppa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

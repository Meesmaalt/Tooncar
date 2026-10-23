import { useEffect, useRef, useState } from "react";
import { Check, Copy, Flag, HelpCircle, Play, Trophy, User, Users, Wifi } from "lucide-react";
import { ToonCarEngine } from "@/game/engine";
import { CAR_DEFINITIONS } from "@/game/cars";
import { TRACK_DEFINITIONS } from "@/game/tracks";
import { preloadTextures } from "@/game/textureLib";
import { soundManager } from "@/audio/soundManager";
import { useP2PRoom } from "@/lib/multiplayer";
import type { CarCustomization, CupStanding, GameMode, PowerUpType, RacerState, SpeedClass } from "@/types";
import { HUD } from "@/components/HUD";
import { CarSelect } from "@/components/CarSelect";
import { TrackSelect } from "@/components/TrackSelect";
import { HelpModal } from "@/components/HelpModal";

type Screen = "menu" | "garage" | "circuit" | "racing" | "results";

const STORAGE = "tooncar-gp-v1";

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (!raw) return null;
    return JSON.parse(raw) as {
      name?: string;
      carId?: string;
      color?: string;
      customization?: CarCustomization;
    };
  } catch {
    return null;
  }
}

function saveState(data: object) {
  try {
    localStorage.setItem(STORAGE, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function GameApp() {
  const saved = loadSave();
  const [screen, setScreen] = useState<Screen>("menu");
  const [playerName, setPlayerName] = useState(saved?.name || "Tommy Rocket");
  const [selectedCarId, setSelectedCarId] = useState(saved?.carId || "speedy_turbo");
  const [selectedColor, setSelectedColor] = useState(saved?.color || "#ef4444");
  const [selectedTrackId, setSelectedTrackId] = useState("sunny_beach");
  const [selectedLaps, setSelectedLaps] = useState(3);
  const [customization, setCustomization] = useState<CarCustomization>(
    saved?.customization || { finish: "gloss", rimStyle: "sport", underglow: "none" },
  );
  const [gameMode, setGameMode] = useState<GameMode>("single");
  const [speedClass, setSpeedClass] = useState<SpeedClass>("100cc");
  const [cupStandings, setCupStandings] = useState<CupStanding[]>([]);
  const [cupStageIndex, setCupStageIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [paused, setPaused] = useState(false);
  const [countdownText, setCountdownText] = useState<string | number>("");
  const [combatEvents, setCombatEvents] = useState<string[]>([]);
  const [raceResults, setRaceResults] = useState<RacerState[]>([]);
  const [roomCode, setRoomCode] = useState(() => {
    if (typeof window !== "undefined" && window.location.hash.startsWith("#room=")) {
      return window.location.hash.slice(6) || "gp-tuba";
    }
    return "gp-tuba";
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [peerProfiles, setPeerProfiles] = useState<
    Record<string, { name: string; carId: string; color: string }>
  >({});

  const p2p = useP2PRoom({
    room: roomCode,
    name: playerName,
    enabled: gameMode === "multiplayer" || screen === "racing",
  });

  const [hudData, setHudData] = useState({
    speed: 0,
    lap: 1,
    totalLaps: 3,
    position: 1,
    totalRacers: 6,
    currentItem: null as PowerUpType | null,
    isDrifting: false,
    hasTurbo: false,
    hasShield: false,
    isWrongWay: false,
    currentLapTime: 0,
    bestLapTime: null as number | null,
    driftCharge: 0,
    surfaceName: "",
    inSlipstream: false,
    isFinalLap: false,
    isLeader: false,
    blueThreat: false,
    fps: 60,
  });
  const [minimapData, setMinimapData] = useState<{
    curvePoints: { x: number; z: number }[];
    racers: { id: string; x: number; z: number; color: string; isPlayer: boolean; position: number }[];
  } | null>(null);

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ToonCarEngine | null>(null);

  useEffect(() => {
    preloadTextures();
  }, []);

  useEffect(() => {
    saveState({ name: playerName, carId: selectedCarId, color: selectedColor, customization });
  }, [playerName, selectedCarId, selectedColor, customization]);

  useEffect(() => {
    const keys = new Set<string>();
    const apply = () => {
      const engine = engineRef.current;
      if (!engine) return;
      const held = (...codes: string[]) => codes.some((c) => keys.has(c));
      engine.localInput.throttle = held("KeyW", "ArrowUp") ? 1 : 0;
      engine.localInput.brake = held("KeyS", "ArrowDown") ? 1 : 0;
      let steer = 0;
      if (held("KeyA", "ArrowLeft")) steer += 1;
      if (held("KeyD", "ArrowRight")) steer -= 1;
      engine.localInput.steer = steer;
      engine.localInput.drift = held("Space", "ShiftLeft", "ShiftRight");
      engine.localInput.lookBehind = held("KeyC");
    };

    const down = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (!engine) return;
      keys.add(e.code);
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) e.preventDefault();
      if (!e.repeat && (e.code === "KeyE" || e.code === "Enter")) engine.localInput.useItem = true;
      if (e.code === "KeyH") engine.localInput.honk = true;
      if (!e.repeat && e.code === "KeyR") engine.localInput.respawn = true;
      if (!e.repeat && e.code === "Escape") {
        e.preventDefault();
        if (engine.gameState === "racing" || engine.gameState === "countdown") {
          engine.paused = !engine.paused;
          setPaused(engine.paused);
        }
      }
      apply();
    };
    const up = (e: KeyboardEvent) => {
      keys.delete(e.code);
      apply();
    };
    const blur = () => {
      keys.clear();
      apply();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  // Sync P2P profile (car, color, name) to peers
  useEffect(() => {
    if (p2p.joined) {
      p2p.send({
        type: "player:profile",
        id: p2p.selfId,
        name: playerName,
        carId: selectedCarId,
        color: selectedColor,
      });
    }
  }, [p2p, playerName, selectedCarId, selectedColor]);

  // Handle incoming network messages
  useEffect(() => {
    const unsub = p2p.onMessage((from, rawData) => {
      const data = rawData as any;
      if (!data || typeof data !== "object") return;

      if (data.type === "player:profile") {
        setPeerProfiles((prev) => ({
          ...prev,
          [from]: {
            name: data.name || from,
            carId: data.carId || "speedy_turbo",
            color: data.color || "#3b82f6",
          },
        }));
      } else if (data.type === "race:start") {
        if (data.trackId) setSelectedTrackId(data.trackId);
        if (data.laps) setSelectedLaps(data.laps);
        if (data.speedClass) setSpeedClass(data.speedClass);
        setScreen("racing");
      } else if (data.type === "player:state") {
        engineRef.current?.applyRemoteState(data.state);
      } else if (data.type === "projectile:spawn") {
        engineRef.current?.applyNetworkProjectile(data.projectile);
      } else if (data.type === "network:hit") {
        engineRef.current?.applyNetworkHit(data.hit);
      } else if (data.type === "box:taken") {
        engineRef.current?.applyItemBoxTaken(data.data);
      }
    });
    return unsub;
  }, [p2p]);

  // High-rate state synchronization during multiplayer racing (~30 Hz)
  useEffect(() => {
    if (screen !== "racing" || gameMode !== "multiplayer") return;
    const interval = window.setInterval(() => {
      const engine = engineRef.current;
      if (!engine) return;
      const sync = engine.getLocalSyncState();
      if (sync) {
        p2p.broadcast({ type: "player:state", state: sync });
      }
    }, 33);
    return () => window.clearInterval(interval);
  }, [screen, gameMode, p2p]);

  useEffect(() => {
    if (screen !== "racing") {
      engineRef.current?.destroy();
      engineRef.current = null;
      return;
    }
    const container = gameContainerRef.current;
    if (!container) return;
    soundManager.init();
    setCombatEvents([]);
    const trackDef = TRACK_DEFINITIONS.find((t) => t.id === selectedTrackId) || TRACK_DEFINITIONS[0];

    const localId = gameMode === "multiplayer" ? p2p.selfId : "player_1";
    let customRacers: { id: string; name: string; carId: string; color: string; isAI: boolean }[] | undefined;

    if (gameMode === "timetrial") {
      customRacers = [{ id: localId, name: playerName, carId: selectedCarId, color: selectedColor, isAI: false }];
    } else if (gameMode === "multiplayer") {
      const connectedHumans = [
        { id: p2p.selfId, name: playerName, carId: selectedCarId, color: selectedColor, isAI: false },
        ...p2p.peers.map((peer) => {
          const prof = peerProfiles[peer.id];
          return {
            id: peer.id,
            name: prof?.name || peer.name || "Sõitja",
            carId: prof?.carId || "speedy_turbo",
            color: prof?.color || "#3b82f6",
            isAI: false,
          };
        }),
      ].sort((a, b) => a.id.localeCompare(b.id));

      const aiFillCount = Math.max(0, 6 - connectedHumans.length);
      const aiDefs = CAR_DEFINITIONS.filter((c) => !connectedHumans.some((h) => h.carId === c.id)).slice(0, aiFillCount);
      customRacers = [
        ...connectedHumans,
        ...aiDefs.map((ai) => ({
          id: `ai_${ai.id}`,
          name: ai.driverName,
          carId: ai.id,
          color: ai.primaryColor,
          isAI: true,
        })),
      ];
    }

    const engine = new ToonCarEngine(
      container,
      trackDef,
      selectedCarId,
      selectedColor,
      selectedLaps,
      {
        onHUDUpdate: (data) => {
          setHudData((prev) => ({ ...prev, ...data }));
          if (data.minimapData) setMinimapData(data.minimapData);
        },
        onCombatEvent: (msg) => {
          setCombatEvents((prev) => [...prev.slice(-1), msg]);
          window.setTimeout(() => {
            setCombatEvents((prev) => prev.filter((m) => m !== msg));
          }, 3200);
        },
        onRaceFinished: (results) => {
          setRaceResults(results);
          if (gameMode === "cup") {
            const pointsTable = [15, 12, 10, 8, 6, 4];
            setCupStandings((prev) => {
              const updated = [...prev];
              results.forEach((r, idx) => {
                const pts = pointsTable[idx] || 2;
                const existing = updated.find((u) => u.racerId === r.id);
                if (existing) {
                  existing.points += pts;
                  if (idx === 0) existing.stageWins += 1;
                } else {
                  updated.push({
                    racerId: r.id,
                    name: r.name,
                    carId: r.carId,
                    points: pts,
                    stageWins: idx === 0 ? 1 : 0,
                  });
                }
              });
              return updated;
            });
          }
          setScreen("results");
        },
        onCountdownTick: (val) => setCountdownText(val),
        onProjectileSpawn: (projectile) => {
          if (gameMode === "multiplayer") {
            p2p.send({ type: "projectile:spawn", projectile });
          }
        },
        onNetworkHit: (hit) => {
          if (gameMode === "multiplayer") {
            p2p.send({ type: "network:hit", hit });
          }
        },
        onItemBoxTaken: (data) => {
          if (gameMode === "multiplayer") {
            p2p.send({ type: "box:taken", data });
          }
        },
      },
      customRacers,
      customization,
      speedClass,
      localId,
    );
    engine.localPlayerId = localId;
    engineRef.current = engine;
    setPaused(false);
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [
    screen,
    selectedTrackId,
    selectedCarId,
    selectedColor,
    selectedLaps,
    customization,
    speedClass,
    gameMode,
    playerName,
    p2p,
    peerProfiles,
  ]);

  const selectedCar = CAR_DEFINITIONS.find((c) => c.id === selectedCarId) || CAR_DEFINITIONS[0];
  const selectedTrack = TRACK_DEFINITIONS.find((t) => t.id === selectedTrackId) || TRACK_DEFINITIONS[0];

  const startRace = () => {
    soundManager.init();
    if (gameMode === "cup") {
      setCupStageIndex(0);
      setCupStandings([]);
      setSelectedTrackId(TRACK_DEFINITIONS[0].id);
    }
    if (gameMode === "multiplayer") {
      p2p.send({
        type: "race:start",
        trackId: selectedTrackId,
        laps: selectedLaps,
        speedClass,
      });
    }
    setScreen("racing");
  };

  const nextCup = () => {
    const next = cupStageIndex + 1;
    if (next < TRACK_DEFINITIONS.length) {
      setCupStageIndex(next);
      setSelectedTrackId(TRACK_DEFINITIONS[next].id);
      setScreen("racing");
    } else {
      setScreen("menu");
    }
  };

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      <div
        ref={gameContainerRef}
        className={`h-full w-full ${screen === "racing" ? "block" : "hidden"}`}
      />

      {screen === "racing" && paused && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-bg/70 p-4">
          <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-6 text-center">
            <h2 className="font-display text-3xl font-semibold">Paus</h2>
            <p className="mt-2 text-sm text-muted">Esc jätkab.</p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                className="h-11 rounded-md bg-accent text-sm font-medium text-accent-fg"
                onClick={() => {
                  if (engineRef.current) engineRef.current.paused = false;
                  setPaused(false);
                }}
              >
                Jätka
              </button>
              <button
                type="button"
                className="h-11 rounded-md border border-line text-sm"
                onClick={() => {
                  engineRef.current?.destroy();
                  engineRef.current = null;
                  setPaused(false);
                  setScreen("menu");
                }}
              >
                Menüü
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === "racing" && (
        <HUD
          speed={hudData.speed}
          lap={hudData.lap}
          totalLaps={hudData.totalLaps}
          position={hudData.position}
          totalRacers={hudData.totalRacers}
          currentItem={hudData.currentItem}
          isDrifting={hudData.isDrifting}
          hasTurbo={hudData.hasTurbo}
          hasShield={hudData.hasShield}
          inSlipstream={hudData.inSlipstream}
          isFinalLap={hudData.isFinalLap}
          isLeader={hudData.isLeader}
          blueThreat={hudData.blueThreat}
          isWrongWay={hudData.isWrongWay}
          currentLapTime={hudData.currentLapTime}
          bestLapTime={hudData.bestLapTime}
          driftCharge={hudData.driftCharge}
          surfaceName={hudData.surfaceName}
          combatEvents={combatEvents}
          countdownText={countdownText}
          minimapData={minimapData}
          fps={hudData.fps}
          multiplayerInfo={{
            isMultiplayer: gameMode === "multiplayer",
            peerCount: p2p.peers.length,
            pingMs: p2p.peers[0]?.rttMs,
          }}
          onUseItem={() => {
            const local = engineRef.current?.racers.find((r) => r.id === engineRef.current?.localPlayerId);
            if (local && engineRef.current) engineRef.current.firePowerUp(local);
          }}
          onHonk={() => soundManager.playHonk()}
          onLookBehindToggle={(active) => {
            if (engineRef.current) engineRef.current.localInput.lookBehind = active;
          }}
          onRespawn={() => {
            if (engineRef.current) engineRef.current.localInput.respawn = true;
          }}
          onInputStart={(action) => {
            const engine = engineRef.current;
            if (!engine) return;
            if (action === "throttle") engine.localInput.throttle = 1;
            if (action === "brake") engine.localInput.brake = 1;
            if (action === "left") engine.localInput.steer = 1;
            if (action === "right") engine.localInput.steer = -1;
            if (action === "drift") engine.localInput.drift = true;
          }}
          onInputEnd={(action) => {
            const engine = engineRef.current;
            if (!engine) return;
            if (action === "throttle") engine.localInput.throttle = 0;
            if (action === "brake") engine.localInput.brake = 0;
            if (action === "left" && engine.localInput.steer > 0) engine.localInput.steer = 0;
            if (action === "right" && engine.localInput.steer < 0) engine.localInput.steer = 0;
            if (action === "drift") engine.localInput.drift = false;
          }}
        />
      )}

      {screen !== "racing" && (
        <div
          className="absolute inset-0 z-30 overflow-y-auto bg-bg"
          style={{
            backgroundImage: "linear-gradient(180deg, rgba(12,13,16,0.55), rgba(12,13,16,0.92)), url(/ui/hero.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-8 sm:py-10">
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-faint">Grand Prix</p>
                <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">ToonCar GP</h1>
                <p className="mt-1 max-w-md text-sm text-muted">
                  Cinematic 3D kart — kuus teemat, drift ja power-up'id.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(true)}
                className="flex h-11 items-center gap-2 rounded-md border border-line bg-surface/80 px-3 text-sm"
              >
                <HelpCircle className="size-4" /> Juhend
              </button>
            </header>

            {screen === "menu" && (
              <div className="mt-auto max-w-xl space-y-4 pb-8">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface/90 p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-12 items-center justify-center rounded-lg border border-line"
                      style={{ backgroundColor: selectedColor }}
                    >
                      <User className="size-5 text-accent-fg mix-blend-difference" />
                    </span>
                    <div>
                      <div className="text-xs uppercase tracking-[0.14em] text-faint">Sõiduk</div>
                      <div className="font-medium">{selectedCar.name}</div>
                      <div className="text-xs text-muted">{selectedCar.driverName}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScreen("garage")}
                    className="h-11 rounded-md border border-line px-3 text-sm"
                  >
                    Garaaž
                  </button>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-faint">Nimi</span>
                  <input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value.slice(0, 18))}
                    className="h-11 w-full rounded-md border border-line bg-surface px-3 text-fg"
                  />
                </label>
                <button
                  id="btn-start"
                  type="button"
                  onClick={() => setScreen("circuit")}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-accent text-base font-medium text-accent-fg"
                >
                  <Play className="size-4" /> Alusta sõitu
                </button>
                <p className="text-xs text-faint">W gaas · A/D rool · tühik drift · E ese</p>
              </div>
            )}

            {screen === "garage" && (
              <div className="rounded-xl border border-line bg-surface/95 p-4 sm:p-6">
                <CarSelect
                  selectedCarId={selectedCarId}
                  selectedColor={selectedColor}
                  customization={customization}
                  onSelectCar={setSelectedCarId}
                  onSelectColor={setSelectedColor}
                  onUpdateCustomization={(c) => setCustomization((prev) => ({ ...prev, ...c }))}
                />
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setScreen("menu")}
                    className="h-11 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg"
                  >
                    Valmis
                  </button>
                </div>
              </div>
            )}

            {screen === "circuit" && (
              <div className="rounded-xl border border-line bg-surface/95 p-4 sm:p-6">
                <TrackSelect
                  selectedTrackId={selectedTrackId}
                  selectedLaps={selectedLaps}
                  gameMode={gameMode}
                  speedClass={speedClass}
                  onSelectTrack={setSelectedTrackId}
                  onSelectLaps={setSelectedLaps}
                  onSelectGameMode={setGameMode}
                  onSelectSpeedClass={setSpeedClass}
                />

                {gameMode === "multiplayer" && (
                  <div className="mt-5 rounded-lg border border-line bg-raised/80 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`size-2.5 rounded-full ${p2p.joined ? "bg-ok animate-pulse" : "bg-warn"}`} />
                        <Wifi className="size-4 text-accent" />
                        <span className="text-sm font-semibold">
                          {p2p.joined ? `Võrgusõidu tuba: ${roomCode}` : "Ühendan võrgutuppa..."}
                        </span>
                        <span className="flex items-center gap-1 rounded bg-line px-2 py-0.5 text-xs text-muted">
                          <Users className="size-3 text-muted" />
                          {p2p.peers.length + 1} sõitja{p2p.peers.length + 1 === 1 ? "" : "t"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const url = `${window.location.origin}${window.location.pathname}#room=${encodeURIComponent(roomCode)}`;
                          navigator.clipboard?.writeText(url);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                        }}
                        className="flex h-9 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-xs font-medium hover:bg-surface/80"
                      >
                        {copiedLink ? <Check className="size-3.5 text-ok" /> : <Copy className="size-3.5" />}
                        {copiedLink ? "Link kopeeritud!" : "Kutsu sõber (link)"}
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 text-xs text-muted">
                        <span>Tuba:</span>
                        <input
                          value={roomCode}
                          onChange={(e) => {
                            const code = e.target.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
                            setRoomCode(code || "gp-tuba");
                            window.location.hash = `#room=${code || "gp-tuba"}`;
                          }}
                          className="h-8 w-32 rounded border border-line bg-surface px-2 text-xs font-mono text-fg"
                          placeholder="toa-kood"
                        />
                      </label>
                      <span className="text-xs text-faint">Jaga toakoodi või linki kaasmängijatele</span>
                    </div>

                    <div className="mt-3 border-t border-line/60 pt-3">
                      <div className="text-[11px] uppercase tracking-wider text-faint">Toas olevad sõitjad:</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 rounded-md border border-accent/40 bg-surface px-3 py-1.5 text-xs">
                          <span className="size-3 rounded-full" style={{ backgroundColor: selectedColor }} />
                          <span className="font-semibold text-fg">{playerName} (Sina)</span>
                          <span className="text-faint">· {selectedCar.name}</span>
                        </div>
                        {p2p.peers.map((peer) => {
                          const prof = peerProfiles[peer.id];
                          const car = CAR_DEFINITIONS.find((c) => c.id === prof?.carId) || CAR_DEFINITIONS[0];
                          return (
                            <div key={peer.id} className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-xs">
                              <span className="size-3 rounded-full" style={{ backgroundColor: prof?.color || "#3b82f6" }} />
                              <span className="font-medium text-fg">{prof?.name || peer.name || "Sõitja"}</span>
                              <span className="text-faint">· {car.name}</span>
                              {peer.rttMs != null && <span className="font-mono text-[10px] text-ok">({peer.rttMs}ms)</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap justify-between gap-2">
                  <button type="button" onClick={() => setScreen("menu")} className="h-11 rounded-md border border-line px-4 text-sm">
                    Tagasi
                  </button>
                  <button
                    id="btn-race"
                    type="button"
                    onClick={startRace}
                    className="flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg"
                  >
                    <Flag className="size-4" />
                    {gameMode === "cup"
                      ? "Alusta karikat"
                      : gameMode === "multiplayer"
                        ? `Alusta võrgusõitu (${p2p.peers.length + 1} mängijat)`
                        : `Sõida: ${selectedTrack.name.split(" (")[0]}`}
                  </button>
                </div>
              </div>
            )}

            {screen === "results" && (
              <div className="mx-auto w-full max-w-lg rounded-xl border border-line bg-surface/95 p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-faint">Finiš</p>
                <h2 className="font-display text-4xl font-semibold">Tulemused</h2>
                <ol className="mt-4 space-y-2">
                  {raceResults.map((r, i) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between rounded-md border border-line bg-raised px-3 py-2 text-sm"
                    >
                      <span className="tabular text-muted">{i + 1}</span>
                      <span className="flex-1 px-3 font-medium">{r.name}</span>
                      <span className="tabular text-faint">
                        {r.finishTime != null ? `${r.finishTime.toFixed(1)}s` : "—"}
                      </span>
                    </li>
                  ))}
                </ol>
                {gameMode === "cup" && cupStandings.length > 0 && (
                  <div className="mt-5">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted">
                      <Trophy className="size-4" /> Karika punktid
                    </div>
                    {cupStandings
                      .slice()
                      .sort((a, b) => b.points - a.points)
                      .map((s) => (
                        <div key={s.racerId} className="flex justify-between py-1 text-sm">
                          <span>{s.name}</span>
                          <span className="tabular">{s.points}</span>
                        </div>
                      ))}
                  </div>
                )}
                <div className="mt-6 flex flex-wrap gap-2">
                  {gameMode === "cup" && cupStageIndex + 1 < TRACK_DEFINITIONS.length ? (
                    <button
                      type="button"
                      onClick={nextCup}
                      className="h-11 flex-1 rounded-md bg-accent text-sm font-medium text-accent-fg"
                    >
                      Järgmine etapp
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setScreen("circuit")}
                      className="h-11 flex-1 rounded-md bg-accent text-sm font-medium text-accent-fg"
                    >
                      Uus sõit
                    </button>
                  )}
                  <button type="button" onClick={() => setScreen("menu")} className="h-11 rounded-md border border-line px-4 text-sm">
                    Menüü
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </main>
  );
}

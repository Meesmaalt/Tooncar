import { useEffect, useRef, useState, type ReactNode } from "react";
import type { PowerUpType } from "@/types";
import { POWER_UPS } from "@/game/powerups";
import { soundManager } from "@/audio/soundManager";
import {
  Volume2,
  VolumeX,
  Shield,
  Zap,
  RotateCcw,
  Eye,
  Flag,
  Gauge,
  Rocket,
  Star,
  Snowflake,
  Droplets,
  Wrench,
  Hammer,
  CloudLightning,
  TriangleAlert,
  Crosshair,
  Aperture,
  Circle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface HUDProps {
  speed: number;
  lap: number;
  totalLaps: number;
  position: number;
  totalRacers: number;
  currentItem: PowerUpType | null;
  isDrifting: boolean;
  hasTurbo: boolean;
  hasShield: boolean;
  inSlipstream?: boolean;
  isFinalLap?: boolean;
  isLeader?: boolean;
  blueThreat?: boolean;
  isWrongWay?: boolean;
  currentLapTime?: number;
  bestLapTime?: number | null;
  driftCharge?: number;
  surfaceName?: string;
  combatEvents: string[];
  countdownText: string | number;
  minimapData: {
    curvePoints: { x: number; z: number }[];
    racers: { id: string; x: number; z: number; color: string; isPlayer: boolean; position: number }[];
  } | null;
  onUseItem: () => void;
  onHonk: () => void;
  onLookBehindToggle?: (active: boolean) => void;
  onRespawn?: () => void;
  onInputStart: (action: "throttle" | "brake" | "left" | "right" | "drift") => void;
  onInputEnd: (action: "throttle" | "brake" | "left" | "right" | "drift") => void;
}

const ITEM_ICON: Record<PowerUpType, typeof Rocket> = {
  rocket: Rocket,
  blue_rocket: Crosshair,
  thundercloud: CloudLightning,
  vortex: Aperture,
  freezeray: Snowflake,
  banana: TriangleAlert,
  star: Star,
  mine: Circle,
  shield: Shield,
  turbo: Zap,
  lightning: CloudLightning,
  anvil: Hammer,
  repair: Wrench,
  trio_rockets: Rocket,
  plasma_cannon: Aperture,
  oil_slick: Droplets,
};

function formatLapTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00.00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${m}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}

function stripEmoji(s: string) {
  return s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").trim();
}

export function HUD({
  speed,
  lap,
  totalLaps,
  position,
  totalRacers,
  currentItem,
  isDrifting,
  hasTurbo,
  hasShield,
  inSlipstream = false,
  isFinalLap = false,
  isWrongWay = false,
  currentLapTime = 0,
  bestLapTime = null,
  driftCharge = 0,
  surfaceName,
  combatEvents,
  countdownText,
  minimapData,
  onUseItem,
  onHonk,
  onLookBehindToggle,
  onRespawn,
  onInputStart,
  onInputEnd,
}: HUDProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [muted, setMuted] = useState(false);
  const ItemIcon = currentItem ? ITEM_ICON[currentItem] : Flag;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !minimapData || minimapData.curvePoints.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0c0d10";
    ctx.fillRect(0, 0, w, h);
    let minX = Infinity,
      maxX = -Infinity,
      minZ = Infinity,
      maxZ = -Infinity;
    for (const p of minimapData.curvePoints) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minZ = Math.min(minZ, p.z);
      maxZ = Math.max(maxZ, p.z);
    }
    const pad = 18;
    const scale = Math.min((w - pad * 2) / Math.max(10, maxX - minX), (h - pad * 2) / Math.max(10, maxZ - minZ));
    const cx = (x: number) => w / 2 + (x - (minX + maxX) / 2) * scale;
    const cy = (z: number) => h / 2 + (z - (minZ + maxZ) / 2) * scale;
    ctx.beginPath();
    minimapData.curvePoints.forEach((p, i) => {
      if (i === 0) ctx.moveTo(cx(p.x), cy(p.z));
      else ctx.lineTo(cx(p.x), cy(p.z));
    });
    ctx.closePath();
    ctx.strokeStyle = "#4b5160";
    ctx.lineWidth = 7;
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.strokeStyle = "#d7dbe2";
    ctx.lineWidth = 1.4;
    ctx.stroke();
    for (const r of minimapData.racers) {
      ctx.fillStyle = r.isPlayer ? "#eef0f3" : r.color || "#c24141";
      ctx.beginPath();
      ctx.arc(cx(r.x), cy(r.z), r.isPlayer ? 4.5 : 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [minimapData]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-md border border-line bg-bg/80 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.14em] text-faint">Koht</div>
            <div className="font-display text-3xl font-semibold tabular leading-none">
              {position}
              <span className="text-base text-muted">/{totalRacers}</span>
            </div>
          </div>
          <div className="rounded-md border border-line bg-bg/80 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.14em] text-faint">Ring</div>
            <div className="font-display text-2xl font-semibold tabular leading-none">
              {lap}
              <span className="text-sm text-muted">/{totalLaps}</span>
            </div>
          </div>
          <div className="hidden rounded-md border border-line bg-bg/80 px-3 py-2 sm:block">
            <div className="text-[10px] uppercase tracking-[0.14em] text-faint">Aeg</div>
            <div className="font-mono text-sm tabular text-accent">{formatLapTime(currentLapTime)}</div>
            {bestLapTime != null && <div className="text-[10px] text-ok">Parim {formatLapTime(bestLapTime)}</div>}
          </div>
          {surfaceName && (
            <div className="hidden rounded-md border border-line bg-bg/80 px-3 py-2 md:block">
              <div className="text-[10px] uppercase tracking-[0.14em] text-faint">Pind</div>
              <div className="text-xs font-medium">{surfaceName}</div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            className="pointer-events-auto flex size-11 items-center justify-center rounded-md border border-line bg-bg/80 text-fg"
            onClick={() => setMuted(soundManager.toggleMute())}
            aria-label="Heli"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <div className="rounded-lg border border-line bg-bg/85 p-1.5">
            <canvas ref={canvasRef} width={148} height={148} className="block size-28 rounded-md sm:size-36" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-4 z-30 flex -translate-x-1/2 flex-col items-center gap-2">
        {currentItem && (
          <button
            type="button"
            onClick={onUseItem}
            className="pointer-events-auto flex min-w-28 flex-col items-center gap-1 rounded-lg border border-accent bg-bg/90 px-4 py-3"
          >
            <ItemIcon className="size-8" />
            <span className="text-xs font-medium uppercase tracking-wide">{POWER_UPS[currentItem]?.name}</span>
            <span className="text-[10px] text-faint">E</span>
          </button>
        )}
        {isWrongWay && (
          <div className="rounded-md border border-danger bg-danger px-4 py-2 text-center text-sm font-medium text-fg">
            Vale suund — pööra või vajuta R
          </div>
        )}
        {isFinalLap && !countdownText && (
          <div className="rounded-full border border-line bg-bg/85 px-4 py-1 text-xs font-medium uppercase tracking-[0.16em]">
            Viimane ring
          </div>
        )}
      </div>

      {countdownText !== "" && countdownText != null && (
        <div className="pointer-events-none absolute left-1/2 top-1/3 z-40 -translate-x-1/2 -translate-y-1/2">
          <div className="font-display text-7xl font-semibold tracking-tight text-accent drop-shadow sm:text-8xl">
            {countdownText}
          </div>
        </div>
      )}

      <div className="max-w-xs space-y-1 self-start">
        {combatEvents.slice(-2).map((evt, i) => (
          <div key={`${evt}-${i}`} className="rounded-md border border-line bg-bg/80 px-3 py-1.5 text-xs text-fg">
            {stripEmoji(evt)}
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1">
            {hasTurbo && (
              <span className="flex items-center gap-1 rounded-md bg-warn px-2 py-1 text-[10px] font-medium text-accent-fg">
                <Zap className="size-3" /> Nitro
              </span>
            )}
            {hasShield && (
              <span className="flex items-center gap-1 rounded-md bg-ok px-2 py-1 text-[10px] font-medium text-fg">
                <Shield className="size-3" /> Kilp
              </span>
            )}
            {inSlipstream && (
              <span className="rounded-md border border-line bg-bg/80 px-2 py-1 text-[10px] font-medium">Draft</span>
            )}
            {isDrifting && (
              <span className="rounded-md border border-accent bg-bg/80 px-2 py-1 text-[10px] font-medium">
                Drift {driftCharge > 0 ? `T${driftCharge}` : ""}
              </span>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-1 rounded-md border border-line bg-bg/80 px-3 py-1.5 text-[11px] text-muted lg:flex">
          <span className="font-mono text-accent">WASD</span> sõit
          <span className="text-line">·</span>
          <span className="font-mono text-accent">Space</span> drift
          <span className="text-line">·</span>
          <span className="font-mono text-accent">E</span> ese
        </div>

        <div className="flex items-center gap-2">
          {onRespawn && (
            <button
              type="button"
              onClick={onRespawn}
              className="pointer-events-auto hidden h-11 items-center gap-1 rounded-md border border-line bg-bg/80 px-3 text-xs sm:flex"
            >
              <RotateCcw className="size-3.5" /> R
            </button>
          )}
          {onLookBehindToggle && (
            <button
              type="button"
              onMouseDown={() => onLookBehindToggle(true)}
              onMouseUp={() => onLookBehindToggle(false)}
              onTouchStart={() => onLookBehindToggle(true)}
              onTouchEnd={() => onLookBehindToggle(false)}
              className="pointer-events-auto hidden h-11 items-center gap-1 rounded-md border border-line bg-bg/80 px-3 text-xs sm:flex"
            >
              <Eye className="size-3.5" /> C
            </button>
          )}
          <button
            type="button"
            onClick={onHonk}
            className="pointer-events-auto hidden size-11 items-center justify-center rounded-md border border-line bg-bg/80 sm:flex"
            aria-label="Signaal"
          >
            <Gauge className="size-4" />
          </button>
          <div className="rounded-lg border border-line bg-bg/85 px-4 py-2 text-center">
            <div className="font-display text-4xl font-semibold tabular leading-none">{speed}</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-faint">km/h</div>
          </div>
        </div>
      </div>

      <div className="pointer-events-auto mt-2 flex items-end justify-between gap-3 pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="flex gap-2">
          <TouchBtn label="Vasak" onStart={() => onInputStart("left")} onEnd={() => onInputEnd("left")}>
            <ChevronLeft className="size-6" />
          </TouchBtn>
          <TouchBtn label="Parem" onStart={() => onInputStart("right")} onEnd={() => onInputEnd("right")}>
            <ChevronRight className="size-6" />
          </TouchBtn>
        </div>
        <div className="flex gap-2">
          <TouchBtn label="Drift" onStart={() => onInputStart("drift")} onEnd={() => onInputEnd("drift")}>
            Drift
          </TouchBtn>
          <TouchBtn label="Pidur" onStart={() => onInputStart("brake")} onEnd={() => onInputEnd("brake")}>
            Pidur
          </TouchBtn>
          <TouchBtn label="Gaas" onStart={() => onInputStart("throttle")} onEnd={() => onInputEnd("throttle")} primary>
            Gaas
          </TouchBtn>
        </div>
      </div>
    </div>
  );
}

function TouchBtn({
  children,
  label,
  onStart,
  onEnd,
  primary,
}: {
  children: ReactNode;
  label: string;
  onStart: () => void;
  onEnd: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onTouchStart={(e) => {
        e.preventDefault();
        onStart();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onEnd();
      }}
      onMouseDown={onStart}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      className={`flex h-14 min-w-14 items-center justify-center rounded-lg border px-3 text-xs font-medium ${
        primary ? "border-accent bg-accent text-accent-fg" : "border-line bg-bg/85 text-fg"
      }`}
    >
      {children}
    </button>
  );
}

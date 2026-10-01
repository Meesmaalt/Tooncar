import { TRACK_DEFINITIONS } from "@/game/tracks";
import type { GameMode, SpeedClass } from "@/types";

interface Props {
  selectedTrackId: string;
  selectedLaps: number;
  gameMode: GameMode;
  speedClass: SpeedClass;
  onSelectTrack: (id: string) => void;
  onSelectLaps: (n: number) => void;
  onSelectGameMode: (m: GameMode) => void;
  onSelectSpeedClass: (s: SpeedClass) => void;
}

const MODES: { id: GameMode; label: string; hint: string }[] = [
  { id: "single", label: "Üksiksõit", hint: "AI vastu" },
  { id: "cup", label: "Karikasari", hint: "Kõik rajad" },
  { id: "timetrial", label: "Ajasõit", hint: "Puhas ring" },
];

export function TrackSelect({
  selectedTrackId,
  selectedLaps,
  gameMode,
  speedClass,
  onSelectTrack,
  onSelectLaps,
  onSelectGameMode,
  onSelectSpeedClass,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Rada</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight">Vali ringrada</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onSelectGameMode(m.id);
                if (m.id === "cup") onSelectTrack(TRACK_DEFINITIONS[0].id);
              }}
              className={`rounded-md border px-3 py-2 text-left ${
                gameMode === m.id ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-fg"
              }`}
            >
              <div className="text-sm font-medium">{m.label}</div>
              <div className={`text-[11px] ${gameMode === m.id ? "text-accent-fg/70" : "text-faint"}`}>{m.hint}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TRACK_DEFINITIONS.map((t) => {
          const active = t.id === selectedTrackId;
          return (
            <button
              key={t.id}
              type="button"
              disabled={gameMode === "cup"}
              onClick={() => onSelectTrack(t.id)}
              className={`overflow-hidden rounded-lg border text-left ${
                active ? "border-accent" : "border-line"
              } ${gameMode === "cup" && !active ? "opacity-50" : ""}`}
            >
              <div className="relative h-28 overflow-hidden bg-raised">
                <img
                  src={`/tracks/${t.id}.jpg`}
                  alt=""
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
                <span className="absolute right-2 top-2 rounded-full bg-bg/80 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                  {t.difficulty}
                </span>
              </div>
              <div className="bg-surface px-3 py-3">
                <div className="font-display text-lg font-semibold leading-tight">{t.name.split(" (")[0]}</div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{t.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-muted">
          Ringid
          <select
            value={selectedLaps}
            onChange={(e) => onSelectLaps(Number(e.target.value))}
            className="h-11 rounded-md border border-line bg-surface px-3 text-fg"
          >
            {[2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-1 rounded-md border border-line bg-surface p-1">
          {(["50cc", "100cc", "150cc"] as SpeedClass[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSelectSpeedClass(s)}
              className={`h-9 rounded-sm px-3 text-xs font-medium ${
                speedClass === s ? "bg-accent text-accent-fg" : "text-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

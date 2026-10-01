import { X } from "lucide-react";

export function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-xl border border-line bg-surface p-6 shadow-[var(--shadow-panel)] sm:rounded-3xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Juhend</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-fg">Kuidas sõita</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-md border border-line text-muted hover:text-fg"
            aria-label="Sulge"
          >
            <X className="size-4" />
          </button>
        </div>
        <dl className="space-y-3 text-sm">
          {[
            ["W / nool üles", "Gaas"],
            ["S / nool alla", "Pidur ja tagasikäik"],
            ["A / D või nooled", "Rool — A vasakule, D paremale"],
            ["Tühik või Shift", "Drift (lae mini-turbo)"],
            ["E või Enter", "Kasuta eset"],
            ["C", "Vaata taha"],
            ["R", "Taasta viimasele kontrollpunktile"],
            ["Esc", "Paus"],
            ["H", "Signaal"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 rounded-md bg-raised px-3 py-2.5">
              <dt className="font-mono text-xs text-accent">{k}</dt>
              <dd className="text-muted">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-faint">
          Puutetekraanil on vasakul rool ja paremal gaas, pidur ning drift. Sõida kolm ringi, kogu esemeid
          kastidest ja ära lõika raja järjestust — kontrollpunktid loevad.
        </p>
      </div>
    </div>
  );
}

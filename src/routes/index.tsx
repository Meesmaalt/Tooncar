import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [App, setApp] = useState<ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("../components/GameApp").then((mod) => {
      if (!cancelled) setApp(() => mod.GameApp);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!App) {
    return (
      <main className="flex min-h-dvh flex-col justify-end bg-bg px-6 py-10 text-fg sm:px-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-faint">Grand Prix</p>
        <h1 className="font-display text-5xl font-semibold tracking-tight">ToonCar GP</h1>
        <p className="mt-2 text-sm text-muted">Laadin rada…</p>
      </main>
    );
  }

  return <App />;
}

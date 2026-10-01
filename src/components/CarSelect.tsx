import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CAR_DEFINITIONS, createToonCarMesh } from "@/game/cars";
import type { CarCustomization, FinishType, RimStyle, UnderglowColor } from "@/types";

const COLORS = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7", "#ec4899", "#18181b", "#ffffff"];
const FINISH: { id: FinishType; label: string }[] = [
  { id: "gloss", label: "Läige" },
  { id: "metallic", label: "Metallik" },
  { id: "matte", label: "Matt" },
];
const RIMS: { id: RimStyle; label: string }[] = [
  { id: "sport", label: "Sport" },
  { id: "monster", label: "Monster" },
  { id: "gold", label: "Kuld" },
  { id: "cyber", label: "Küber" },
];
const GLOW: { id: UnderglowColor; label: string }[] = [
  { id: "none", label: "Väljas" },
  { id: "#06b6d4", label: "Tsüaan" },
  { id: "#22c55e", label: "Roheline" },
  { id: "#ec4899", label: "Roosa" },
  { id: "#eab308", label: "Kuldne" },
  { id: "#a855f7", label: "Lilla" },
];

interface Props {
  selectedCarId: string;
  selectedColor: string;
  customization: CarCustomization;
  onSelectCar: (id: string) => void;
  onSelectColor: (c: string) => void;
  onUpdateCustomization: (c: Partial<CarCustomization>) => void;
}

export function CarSelect({
  selectedCarId,
  selectedColor,
  customization,
  onSelectCar,
  onSelectColor,
  onUpdateCustomization,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const car = CAR_DEFINITIONS.find((c) => c.id === selectedCarId) || CAR_DEFINITIONS[0];

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const w = host.clientWidth || 360;
    const h = host.clientHeight || 240;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 40);
    camera.position.set(3.6, 1.9, 4.4);
    camera.lookAt(0, 0.55, 0);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    host.replaceChildren(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xf8fafc, 0x1e293b, 0.9));
    const key = new THREE.DirectionalLight(0xfff4e0, 2.2);
    key.position.set(4, 8, 6);
    key.castShadow = true;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x93c5fd, 0.7);
    rim.position.set(-6, 3, -4);
    scene.add(rim);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.4, 48),
      new THREE.MeshStandardMaterial({ color: 0x16171c, roughness: 0.55, metalness: 0.35 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const mesh = createToonCarMesh(car, selectedColor, customization);
    scene.add(mesh.root);

    let id = 0;
    let live = true;
    const spin = () => {
      if (!live) return;
      mesh.root.rotation.y += 0.008;
      renderer.render(scene, camera);
      id = requestAnimationFrame(spin);
    };
    spin();
    return () => {
      live = false;
      cancelAnimationFrame(id);
      renderer.dispose();
      host.replaceChildren();
    };
  }, [selectedCarId, selectedColor, customization, car]);

  const stats = [
    { label: "Kiirus", v: car.stats.speed },
    { label: "Kiirendus", v: car.stats.accel },
    { label: "Rool", v: car.stats.handling },
    { label: "Armor", v: car.stats.armor },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="overflow-hidden rounded-xl border border-line bg-raised">
        <div ref={hostRef} className="h-56 w-full sm:h-72" />
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Garaaž</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight">{car.name}</h2>
          <p className="mt-1 text-sm text-muted">{car.description}</p>
          <p className="mt-1 text-xs text-faint">Juht: {car.driverName}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CAR_DEFINITIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                onSelectCar(c.id);
                onSelectColor(c.primaryColor);
              }}
              className={`rounded-md border px-3 py-2.5 text-left text-sm font-medium ${
                c.id === selectedCarId ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-fg hover:border-muted"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>{s.label}</span>
                <span className="tabular">{s.v}/10</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-line">
                <div className="h-full bg-accent" style={{ width: `${s.v * 10}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-faint">Värv</p>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                onClick={() => onSelectColor(c)}
                className={`size-8 rounded-full border ${selectedColor === c ? "border-accent ring-2 ring-accent" : "border-line"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <Tune label="Lakk" options={FINISH} value={customization.finish} onChange={(finish) => onUpdateCustomization({ finish })} />
          <Tune label="Veljed" options={RIMS} value={customization.rimStyle} onChange={(rimStyle) => onUpdateCustomization({ rimStyle })} />
          <Tune
            label="Allvalgus"
            options={GLOW}
            value={customization.underglow}
            onChange={(underglow) => onUpdateCustomization({ underglow })}
          />
        </div>
      </div>
    </div>
  );
}

function Tune<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-faint">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-11 w-full rounded-md border border-line bg-surface px-2 text-fg"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

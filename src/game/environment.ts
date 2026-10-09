import * as THREE from "three";
import type { TrackDefinition } from "../types";
import type { TrackData } from "./tracks";
import { GROUND_BY_THEME, repeatingGround, skyTexture } from "./textureLib";

const _dummy = new THREE.Object3D();

function makeLambert(color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.78,
    metalness: 0.08,
    ...opts,
  });
}

export function addWorldDressing(
  scene: THREE.Scene,
  trackDef: TrackDefinition,
  track: TrackData,
): { group: THREE.Group; water?: THREE.Mesh } {
  const group = new THREE.Group();
  group.name = "world-dressing";

  const skyTex = skyTexture(trackDef.theme);
  const skyGeo = new THREE.SphereGeometry(820, 32, 20);
  skyGeo.scale(-1, 1, 1);
  const skyMat = skyTex
    ? new THREE.MeshBasicMaterial({ map: skyTex, depthWrite: false })
    : new THREE.MeshBasicMaterial({ color: trackDef.skyColor, depthWrite: false });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.renderOrder = -10;
  group.add(sky);

  if (trackDef.theme !== "sky") {
    const groundName = GROUND_BY_THEME[trackDef.theme] || "ground_beach";
    const gTex = repeatingGround(groundName, 42);
    const ground = new THREE.Mesh(
      trackDef.theme === "beach" ? coastalIsland(track) : new THREE.CircleGeometry(1100, 64),
      new THREE.MeshStandardMaterial({
        map: gTex.image ? gTex : undefined,
        color: gTex.image ? 0xffffff : trackDef.groundColor,
        roughness: 0.95,
        metalness: 0.02,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.22;
    ground.receiveShadow = true;
    group.add(ground);
  }

  scatterThemeProps(group, track, trackDef.theme);
  addHorizonSilhouettes(group, trackDef.theme);

  let water: THREE.Mesh | undefined;
  if (trackDef.theme === "beach" || trackDef.theme === "ice") {
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: trackDef.theme === "ice" ? 0x9fd4ea : 0x1d6f9a,
      roughness: 0.18,
      metalness: 0.15,
      transmission: 0.15,
      transparent: true,
      opacity: 0.88,
      envMapIntensity: 0.8,
    });
    water = new THREE.Mesh(new THREE.CircleGeometry(980, 48), waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = trackDef.theme === "ice" ? -0.55 : -0.85;
    group.add(water);
  }

  scene.add(group);
  return { group, water };
}

// Follow the circuit footprint so the ocean remains visible from the coast road.
function coastalIsland(track: TrackData): THREE.ShapeGeometry {
  const outline = new THREE.Shape();
  for (let i = 0; i < 160; i++) {
    const p = track.curve.getPointAt(i / 160);
    const tangent = track.curve.getTangentAt(i / 160);
    const outward = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();
    p.addScaledVector(outward, 38);
    if (i === 0) outline.moveTo(p.x, -p.z);
    else outline.lineTo(p.x, -p.z);
  }
  outline.closePath();
  return new THREE.ShapeGeometry(outline);
}

function scatterThemeProps(group: THREE.Group, track: TrackData, theme: TrackDefinition["theme"]) {
  const pts = track.centerlinePoints;
  const count = Math.min(90, Math.floor(pts.length / 3));
  if (count <= 0) return;

  if (theme === "cyber") {
    scatterBuildings(group, pts, count);
    return;
  }

  const trunkGeo = new THREE.CylinderGeometry(0.28, 0.45, 4.2, 6);
  const crownGeo =
    theme === "beach"
      ? new THREE.SphereGeometry(1.7, 7, 6)
      : new THREE.ConeGeometry(1.8, 4.4, 7);
  const rockGeo = new THREE.DodecahedronGeometry(1.15, 0);

  const trunkMat = makeLambert(
    theme === "volcano" ? 0x1c1917 : theme === "spooky" ? 0x1f1a16 : 0x5c3a22,
  );
  const crownMat = makeLambert(
    theme === "ice" ? 0xdbeafe : theme === "volcano" ? 0x292524 : theme === "spooky" ? 0x14532d : theme === "sky" ? 0xbbf7d0 : 0x166534,
    theme === "volcano" ? { emissive: 0x7c2d12, emissiveIntensity: 0.35 } : {},
  );
  const rockMat = makeLambert(
    theme === "ice" ? 0xcbd5e1 : theme === "volcano" ? 0x1c1917 : 0x57534e,
  );

  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, count);
  const crowns = new THREE.InstancedMesh(crownGeo, crownMat, count);
  const rocks = new THREE.InstancedMesh(rockGeo, rockMat, count);
  trunks.castShadow = true;
  crowns.castShadow = true;
  rocks.castShadow = true;
  trunks.frustumCulled = false;
  crowns.frustumCulled = false;
  rocks.frustumCulled = false;

  let n = 0;
  for (let i = 2; i < pts.length && n < count; i += 4) {
    const side = n % 2 === 0 ? 1 : -1;
    const dist = 20 + ((n * 17) % 22);
    const cp = pts[i];
    const x = cp.point.x + cp.right.x * side * dist;
    const z = cp.point.z + cp.right.z * side * dist;
    const y = Math.max(0, cp.point.y);
    const s = 0.85 + ((n * 13) % 10) / 14;

    _dummy.position.set(x, y + 2.1 * s, z);
    _dummy.rotation.set(0, n * 0.7, 0);
    _dummy.scale.set(s, s, s);
    _dummy.updateMatrix();
    trunks.setMatrixAt(n, _dummy.matrix);

    _dummy.position.set(x, y + (theme === "beach" ? 4.4 : 5.2) * s, z);
    _dummy.scale.set(s * (theme === "beach" ? 1.3 : 1), s, s * (theme === "beach" ? 1.3 : 1));
    _dummy.updateMatrix();
    crowns.setMatrixAt(n, _dummy.matrix);

    const rx = x + cp.right.x * side * 4.5;
    const rz = z + cp.right.z * side * 4.5;
    _dummy.position.set(rx, y + 0.4, rz);
    _dummy.rotation.set(n * 0.4, n * 1.1, n * 0.2);
    _dummy.scale.setScalar(0.7 + (n % 5) * 0.18);
    _dummy.updateMatrix();
    rocks.setMatrixAt(n, _dummy.matrix);
    n++;
  }

  trunks.count = n;
  crowns.count = n;
  rocks.count = n;
  trunks.instanceMatrix.needsUpdate = true;
  crowns.instanceMatrix.needsUpdate = true;
  rocks.instanceMatrix.needsUpdate = true;
  group.add(trunks, crowns, rocks);
}

function scatterBuildings(group: THREE.Group, pts: TrackData["centerlinePoints"], count: number) {
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const matA = makeLambert(0x0b1220, { emissive: 0x0891b2, emissiveIntensity: 0.28, metalness: 0.55, roughness: 0.35 });
  const matB = makeLambert(0x111827, { emissive: 0xdb2777, emissiveIntensity: 0.22, metalness: 0.5, roughness: 0.4 });
  const meshA = new THREE.InstancedMesh(boxGeo, matA, count);
  const meshB = new THREE.InstancedMesh(boxGeo, matB, count);
  meshA.castShadow = true;
  meshB.castShadow = true;
  let a = 0;
  let b = 0;
  for (let i = 3; i < pts.length && a + b < count; i += 3) {
    const side = (a + b) % 2 === 0 ? 1 : -1;
    const dist = 24 + ((a + b) % 7) * 3;
    const cp = pts[i];
    const x = cp.point.x + cp.right.x * side * dist;
    const z = cp.point.z + cp.right.z * side * dist;
    const h = 8 + ((a + b) % 9) * 3.2;
    const w = 3.2 + ((a + b) % 4);
    _dummy.position.set(x, Math.max(0, cp.point.y) + h * 0.5, z);
    _dummy.rotation.set(0, (a + b) * 0.3, 0);
    _dummy.scale.set(w, h, w * 0.85);
    _dummy.updateMatrix();
    if ((a + b) % 2 === 0) {
      meshA.setMatrixAt(a++, _dummy.matrix);
    } else {
      meshB.setMatrixAt(b++, _dummy.matrix);
    }
  }
  meshA.count = a;
  meshB.count = b;
  meshA.instanceMatrix.needsUpdate = true;
  meshB.instanceMatrix.needsUpdate = true;
  group.add(meshA, meshB);
}

function addHorizonSilhouettes(group: THREE.Group, theme: TrackDefinition["theme"]) {
  const n = 14;
  const geo = new THREE.IcosahedronGeometry(1, 0);
  const mat = makeLambert(
    theme === "ice" ? 0xe2e8f0 : theme === "volcano" ? 0x1c1917 : theme === "cyber" ? 0x020617 : theme === "spooky" ? 0x111827 : 0x365314,
    { roughness: 1 },
  );
  const mesh = new THREE.InstancedMesh(geo, mat, n);
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2;
    const r = 420 + (i % 5) * 40;
    const h = 28 + (i % 6) * 16;
    _dummy.position.set(Math.cos(ang) * r, h * 0.15, Math.sin(ang) * r);
    _dummy.scale.set(18 + (i % 4) * 8, h, 18 + ((i + 2) % 4) * 8);
    _dummy.rotation.set(0, ang, 0);
    _dummy.updateMatrix();
    mesh.setMatrixAt(i, _dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  group.add(mesh);
}

export function createSun(theme: TrackDefinition["theme"]) {
  const color =
    theme === "volcano" ? 0xff7a45 : theme === "spooky" ? 0xc4b5fd : theme === "cyber" ? 0x67e8f9 : theme === "ice" ? 0xe0f2fe : 0xfff1c9;
  const intensity = theme === "spooky" || theme === "cyber" ? 1.2 : 1.6;
  const sun = new THREE.DirectionalLight(color, intensity);
  sun.position.set(70, 120, 55);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 4;
  sun.shadow.camera.far = 220;
  sun.shadow.camera.left = -55;
  sun.shadow.camera.right = 55;
  sun.shadow.camera.top = 55;
  sun.shadow.camera.bottom = -55;
  sun.shadow.bias = -0.00025;
  sun.shadow.normalBias = 0.04;
  const target = new THREE.Object3D();
  sun.target = target;
  return { sun, target };
}

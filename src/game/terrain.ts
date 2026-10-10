import * as THREE from 'three';
import type { TrackData } from './tracks';

// Road-level terraces merge into broad slopes, rather than leaving elevated asphalt suspended.
export function createTerrainGeometry(track: TrackData, coastal = false): THREE.BufferGeometry {
  const samples = track.centerlinePoints.filter((_, i) => i % 4 === 0);
  const xs = samples.map(s => s.point.x), zs = samples.map(s => s.point.z);
  const padding = coastal ? 120 : 230;
  const minX = Math.min(...xs) - padding, maxX = Math.max(...xs) + padding;
  const minZ = Math.min(...zs) - padding, maxZ = Math.max(...zs) + padding;
  const nx = Math.ceil((maxX - minX) / 5), nz = Math.ceil((maxZ - minZ) / 5);
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  const inside: boolean[] = [];
  const outline = coastal ? samples.map(s => ({ x: s.point.x, z: s.point.z })) : [];
  const inIsland = (x: number, z: number) => {
    let result = false;
    for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
      const a = outline[i], b = outline[j];
      if ((a.z > z) !== (b.z > z) && x < (b.x - a.x) * (z - a.z) / (b.z - a.z) + a.x) result = !result;
    }
    return result;
  };
  for (let iz = 0; iz <= nz; iz++) for (let ix = 0; ix <= nx; ix++) {
    const x = minX + (maxX - minX) * ix / nx, z = minZ + (maxZ - minZ) * iz / nz;
    let distanceSq = Infinity, roadY = 0;
    // Segment projection avoids stair steps in hill height between centerline samples.
    for (let i = 0; i < samples.length; i++) {
      const a = samples[i].point, b = samples[(i + 1) % samples.length].point;
      const dx = b.x - a.x, dz = b.z - a.z;
      const t = THREE.MathUtils.clamp(((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz), 0, 1);
      const d = (x - a.x - dx * t) ** 2 + (z - a.z - dz * t) ** 2;
      if (d < distanceSq) { distanceSq = d; roadY = THREE.MathUtils.lerp(a.y, b.y, t); }
    }
    const distance = Math.sqrt(distanceSq);
    const blend = THREE.MathUtils.smoothstep(distance, 44, coastal ? 90 : 135);
    const hills = coastal ? 1.4 : 5;
    const base = -0.3 + hills * (0.5 + 0.5 * Math.sin(x * 0.021) * Math.cos(z * 0.018));
    const height = THREE.MathUtils.lerp(roadY - 0.24, base, blend);
    positions.push(x, height, z);
    uvs.push((x - minX) / (maxX - minX), (z - minZ) / (maxZ - minZ));
    inside.push(!coastal || distance < 78 + 6 * Math.sin(x * 0.032) * Math.cos(z * 0.025) || inIsland(x, z));
  }
  for (let iz = 0; iz < nz; iz++) for (let ix = 0; ix < nx; ix++) {
    const a = iz * (nx + 1) + ix, b = a + 1, c = a + nx + 1, d = c + 1;
    if (inside[a] && inside[b] && inside[c]) indices.push(a, c, b);
    if (inside[b] && inside[c] && inside[d]) indices.push(b, c, d);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices); geometry.computeVertexNormals();
  return geometry;
}

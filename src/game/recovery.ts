import * as THREE from 'three';
import type { RacerState } from '../types';
import type { TrackData } from './tracks';
import { grantHazardRecovery } from './combatRules';

type Obstacle = { x: number; y: number; z: number; radius?: number };

// Search backwards from earned progress. Resetting must never award a checkpoint or lap.
export function recoverRacer(racer: RacerState, track: TrackData, nearby: Obstacle[] = []) {
  const length = track.curve.getLength();
  const checkpoint = Math.max(0, Math.min(track.checkpoints.length - 1, racer.checkpointIndex || 0));
  const checkpointT = checkpoint / track.checkpoints.length;
  const relativeT = Number.isFinite(racer.trackT) ? ((racer.trackT! - checkpointT + 1.5) % 1) - 0.5 : 0;
  // Checkpoints are accepted with a generous radius; avoid jumping forward to one not yet reached.
  const anchorT = checkpoint === 0 ? 0 : relativeT < 0 && relativeT > -60 / length ? (checkpointT + relativeT + 1) % 1 : checkpointT;
  const obstacles: Obstacle[] = [
    ...track.hazards,
    ...track.jumpRamps.map(r => ({ ...r, radius: Math.hypot(r.width / 2, 3.2) })),
    ...nearby,
  ];
  let best: { point: THREE.Vector3; tangent: THREE.Vector3; t: number; clearance: number } | undefined;
  for (let back = 6; back <= 90; back += 6) {
    // The start grid is safe to reset to, but must not wrap a new racer behind the finish line.
    const t = checkpoint === 0 ? Math.max(0, anchorT - back / length) : (anchorT - back / length + 1) % 1;
    const center = track.curve.getPointAt(t), tangent = track.curve.getTangentAt(t);
    const right = new THREE.Vector3(tangent.z, 0, -tangent.x).normalize();
    for (const lane of [0, -4, 4, -7, 7]) {
      const point = center.clone().addScaledVector(right, lane);
      let clearance = Infinity;
      for (const obstacle of obstacles) {
        if (Math.abs(point.y - obstacle.y) > 5) continue;
        clearance = Math.min(clearance, Math.hypot(point.x - obstacle.x, point.z - obstacle.z) - (obstacle.radius ?? 3) - 3);
      }
      if (!best || clearance > best.clearance) best = { point, tangent, t, clearance };
      if (clearance >= 0) break;
    }
    if (best && best.clearance >= 0) break;
  }
  const spawn = best!;
  const info = track.getTrackInfo(spawn.point);
  Object.assign(racer, {
    x: spawn.point.x, y: spawn.point.y, z: spawn.point.z,
    rotY: Math.atan2(spawn.tangent.x, spawn.tangent.z),
    rotX: -Math.asin(THREE.MathUtils.clamp(spawn.tangent.y, -0.65, 0.65)), rotZ: 0,
    speed: 0, steerAngle: 0, spinTimer: 0, frozenTimer: 0, turboTimer: 0,
    isDrifting: false, driftFactor: 0, driftChargeTime: 0,
    isAirborne: false, vy: 0, airTime: 0, stuntTimer: 0,
    stuntType: null, stuntCompleted: false, stuntAngleX: 0, stuntAngleY: 0, stuntAngleZ: 0,
    bounceOffset: 0, isWrongWay: false, centerlineIndex: info.closestIndex, trackT: spawn.t,
    currentSurface: info.surface, surfaceName: info.surfaceName, surfaceIcon: info.surfaceIcon,
  });
  grantHazardRecovery(racer);
}

interface Position { x: number; y: number; z: number }
interface Hazard extends Position { id: string; radius: number }
const encounters = new WeakMap<object, { contacts: Set<string>; grace: number }>();

export function stepHazardContacts(racer: Position, hazards: Hazard[], dt: number) {
  let state = encounters.get(racer);
  if (!state) { state = { contacts: new Set(), grace: 0 }; encounters.set(racer, state); }
  state.grace = Math.max(0, state.grace - dt);
  for (const id of state.contacts) {
    const hazard = hazards.find(h => h.id === id);
    if (!hazard || Math.hypot(racer.x - hazard.x, racer.y - hazard.y, racer.z - hazard.z) > hazard.radius + 3) state.contacts.delete(id);
  }
}

export function claimHazardContact(racer: Position, hazard: Hazard): boolean {
  const state = encounters.get(racer)!;
  if (state.contacts.has(hazard.id)) return false;
  // Latch contacts even during grace, so another overlapping trap cannot keep a car pinned.
  state.contacts.add(hazard.id);
  if (state.grace > 0) return false;
  state.grace = 2.8;
  return true;
}

export function isInCryoCone(origin: Position & { vx: number; vz: number }, target: Position, radius: number): boolean {
  const dx = target.x - origin.x, dz = target.z - origin.z;
  const distance = Math.hypot(dx, dz), headingLength = Math.hypot(origin.vx, origin.vz);
  if (distance > radius || Math.abs(target.y - origin.y) > 3 || headingLength < 0.001) return false;
  return distance < 0.01 || (dx * origin.vx + dz * origin.vz) / (distance * headingLength) >= Math.cos(Math.PI / 5);
}

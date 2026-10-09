import * as THREE from 'three';
import { stepHazardContacts, claimHazardContact, isInCryoCone } from './combatRules';
import { RacerState, PlayerInput, Projectile, CarDefinition } from '../types';
import { TrackData } from './tracks';
import { CAR_DEFINITIONS } from './cars';
import { getRandomPowerUp } from './powerups';
import { soundManager } from '../audio/soundManager';

// Pre-allocated static scratch vectors for zero-allocation physics updates
const _physCarPos = new THREE.Vector3();
const _physCarFwd = new THREE.Vector3();
const _physForwardDir = new THREE.Vector3();

export interface CollisionEvent {
  type: 'car_bump' | 'wall_hit' | 'item_box' | 'rocket_hit' | 'blue_rocket_hit' | 'thundercloud_strike' | 'banana_hit' | 'mine_hit' | 'boost_pad' | 'freezeray_hit' | 'vortex_suck' | 'plasma_hit' | 'oil_slip' | 'jump_ramp' | 'stunt_boost' | 'stunt_ring' | 'hazard_hit';
  racerId: string;
  targetId?: string;
  x: number;
  y: number;
  z: number;
  hazardName?: string;
}

/**
 * Updates physics for a single racer over delta time
 */
export function updateRacerPhysics(
  racer: RacerState,
  input: PlayerInput,
  track: TrackData,
  dt: number,
  onCollision?: (event: CollisionEvent) => void,
  speedFactor: number = 1.0
) {
  stepHazardContacts(racer, track.hazards || [], dt);
  // Prefer cached def on racer if present (avoids Array.find every frame)
  const carDef = (racer as any)._carDef || CAR_DEFINITIONS.find(c => c.id === racer.carId) || CAR_DEFINITIONS[0];
  (racer as any)._carDef = carDef;
  const isIceTrack = track.theme === 'ice';
  
  // Tuned for polished, realistic arcade racing: satisfying sense of speed, full control, and zero twitchiness
  const maxBaseSpeed = (17.5 + carDef.stats.speed * 0.65) * speedFactor;
  const accelPower = (13.5 + carDef.stats.accel * 0.95) * speedFactor;
  const handlingPower = (2.2 + carDef.stats.handling * 0.16) * (isIceTrack ? 0.90 : 1.0);

  // Handle respawn / reset
  if (input.respawn) {
    input.respawn = false;
    const cp = track.checkpoints[racer.checkpointIndex];
    const nextCp = track.checkpoints[(racer.checkpointIndex + 1) % track.checkpoints.length];
    _physForwardDir.subVectors(nextCp, cp).normalize();
    racer.x = cp.x;
    racer.y = cp.y + 0.3;
    racer.z = cp.z;
    racer.rotY = Math.atan2(_physForwardDir.x, _physForwardDir.z);
    racer.speed = 0;
    racer.spinTimer = 0;
    racer.frozenTimer = 0;
    racer.driftChargeTime = 0;
    racer.rotX = 0;
    soundManager.playRespawn();
    return;
  }

  // Handle spinout (e.g. hit by rocket or mine)
  if (racer.spinTimer > 0) {
    racer.spinTimer -= dt;
    racer.rotY += Math.PI * 5 * dt; // Spin out
    racer.speed = Math.max(0, racer.speed - 24 * dt);

    // Apply motion
    racer.x += Math.sin(racer.rotY) * racer.speed * dt * 0.3;
    racer.z += Math.cos(racer.rotY) * racer.speed * dt * 0.3;
    return;
  }

  // Handle frozen / zap
  if (racer.frozenTimer > 0) {
    racer.frozenTimer -= dt;
  }

  // Handle turbo & star
  let speedMultiplier = 1.0;
  if (racer.turboTimer > 0) {
    racer.turboTimer -= dt;
    speedMultiplier = Math.max(speedMultiplier, 1.35);
  }
  if (racer.starTimer > 0) {
    racer.starTimer -= dt;
    speedMultiplier = Math.max(speedMultiplier, 1.42);
  }
  if (racer.frozenTimer > 0 && !(racer.starTimer > 0)) {
    speedMultiplier *= 0.45;
  }

  // --- Realistic Vehicle Dynamics: Weight Transfer, Cornering Grip & Handbrake Drift ---
  // Handbrake (Space / Shift / drift button) breaks rear tire static grip
  const wantsHandbrake = input.drift && Math.abs(racer.speed) > 2.8;
  const isIceDrift = isIceTrack && Math.abs(input.steer) > 0.65 && Math.abs(racer.speed) > 4.5;
  const isDrifting = wantsHandbrake || isIceDrift;

  // Weight transfer calculation: braking loads front tires (+grip), acceleration loads rear
  let weightTransferFront = 0;
  if (input.brake > 0) {
    weightTransferFront = 0.22 * input.brake;
  } else if (input.throttle > 0) {
    weightTransferFront = -0.12 * input.throttle;
  }

  // Effective acceleration power (reduced when shocked/frozen)
  const effectiveAccel = (racer.frozenTimer > 0 && !(racer.starTimer > 0)) ? accelPower * 0.45 : accelPower;

  // Acceleration & Braking with progressive tire slip scrub
  const topSpeed = maxBaseSpeed * speedMultiplier;
  
  if (isDrifting) {
    // Handbrake physics: rear tires slide with controlled power-slide friction.
    // Maintaining throttle keeps engine revs high to power through the slide
    const driftScrub = isIceTrack ? 3.8 : 7.2;
    if (input.throttle > 0) {
      racer.speed = Math.max(isIceTrack ? 6.0 : 7.0, racer.speed - (driftScrub * 0.28) * dt + (effectiveAccel * 0.42) * input.throttle * dt);
      if (racer.speed > topSpeed) {
        racer.speed = THREE.MathUtils.lerp(racer.speed, topSpeed, dt * 2.0);
      }
    } else {
      // Coasting / decelerating during slide
      racer.speed = Math.max(0, racer.speed - driftScrub * dt);
    }
  } else if (input.throttle > 0) {
    if (racer.speed < topSpeed) {
      racer.speed = Math.min(topSpeed, racer.speed + effectiveAccel * input.throttle * dt);
    } else {
      racer.speed = THREE.MathUtils.lerp(racer.speed, topSpeed, dt * 3.0);
    }
  } else if (input.brake > 0) {
    // Progressive foot brake (S / Down) — linear deceleration + smooth reverse gear
    if (racer.speed > 0.4) {
      racer.speed = Math.max(0, racer.speed - accelPower * 2.4 * input.brake * dt);
    } else if (racer.speed > -10) {
      racer.speed -= accelPower * 1.1 * input.brake * dt;
    }
  } else {
    // Natural rolling resistance and aerodynamic air drag
    const dragRate = isIceTrack ? 2.8 : 5.2;
    if (racer.speed > 0) {
      racer.speed = Math.max(0, racer.speed - dragRate * dt);
    } else if (racer.speed < 0) {
      racer.speed = Math.min(0, racer.speed + dragRate * dt);
    }
  }

  // Drifting state & 3-Tier Mini-Turbo (charge while holding controlled power-slides)
  racer.isDrifting = isDrifting;
  if (racer.isDrifting) {
    racer.driftFactor = Math.min(1.4, (racer.driftFactor || 0) + dt * (isIceTrack ? 1.5 : 1.25));
    // Mini-turbo charges when sliding into or counter-steering corners
    if (Math.abs(input.steer) > 0.15 || Math.abs(racer.steerAngle) > 0.15) {
      racer.driftChargeTime = (racer.driftChargeTime || 0) + dt;
    } else {
      racer.driftChargeTime = (racer.driftChargeTime || 0) + dt * 0.4;
    }
  } else {
    // Releasing handbrake snaps out of drift and unleashes stored mini-turbo boost!
    if (racer.driftChargeTime >= 0.55) {
      if (racer.driftChargeTime >= 2.2) {
        // Purple / Level 3 Ultra Mini-Turbo
        racer.turboTimer = 2.4;
        racer.speed = Math.max(racer.speed + 11, maxBaseSpeed * 1.32);
        soundManager.playTurbo();
      } else if (racer.driftChargeTime >= 1.35) {
        // Orange / Level 2 Super Mini-Turbo
        racer.turboTimer = 1.6;
        racer.speed = Math.max(racer.speed + 7.5, maxBaseSpeed * 1.22);
        soundManager.playTurbo();
      } else {
        // Blue / Level 1 Mini-Turbo
        racer.turboTimer = 0.95;
        racer.speed = Math.max(racer.speed + 5.0, maxBaseSpeed * 1.14);
        soundManager.playMiniTurbo();
      }
    }
    racer.driftChargeTime = 0;
    racer.driftFactor = Math.max(0, (racer.driftFactor || 0) - dt * 3.5);
  }

  // Realistic steering response & caster self-centering:
  // Weight transfer to front wheels enhances steering bite
  const steerAmp = racer.isDrifting ? 0.60 : 0.44;
  const targetSteerAngle = input.steer * steerAmp;
  const steerLerpSpeed = racer.isDrifting ? 18.0 : 15.0;
  racer.steerAngle = THREE.MathUtils.lerp(racer.steerAngle, targetSteerAngle, dt * steerLerpSpeed);

  if (Math.abs(racer.speed) > 0.3) {
    const speedSteerFactor = THREE.MathUtils.clamp(Math.abs(racer.speed) / 12, 0.40, 1.05);
    const frontGripMod = 1.0 + weightTransferFront;
    // Drift yaw multiplier: lets players initiate sharp pivot hairpins or hold smooth sweeping arcs
    const driftSteerBonus = racer.isDrifting ? (1.70 + (racer.driftFactor || 0) * 0.42) : 1.0;
    const direction = racer.speed >= 0 ? 1 : -1;
    racer.rotY += racer.steerAngle * handlingPower * speedSteerFactor * frontGripMod * driftSteerBonus * dt * direction;
  }

  // Realistic lateral inertia & slip angle while drifting:
  // Forward motion combines vehicle heading with lateral slide slip angle
  const moveSpeed = racer.speed * dt;
  const driftSlip = racer.isDrifting 
    ? racer.steerAngle * (0.38 + (racer.driftFactor || 0) * 0.24) 
    : 0;
  const moveHeading = racer.rotY + driftSlip;
  racer.x += Math.sin(moveHeading) * moveSpeed;
  racer.z += Math.cos(moveHeading) * moveSpeed;

  // Accurate track centerline query using continuous spline
  _physCarPos.set(racer.x, racer.y, racer.z);
  const trackInfo = track.getTrackInfo(_physCarPos, racer.centerlineIndex);
  racer.centerlineIndex = trackInfo.closestIndex;
  racer.trackT = trackInfo.t;
  racer.currentSurface = trackInfo.surface || 'asphalt';
  racer.surfaceName = trackInfo.surfaceName || 'Rannatee';
  racer.surfaceIcon = trackInfo.surfaceIcon || '🛣️';

  // Height adherence & Dynamic Airborne 3D Physics
  const targetY = trackInfo.closestPoint.y;
  if (racer.isAirborne) {
    racer.airTime = (racer.airTime || 0) + dt;
    racer.vy = (racer.vy || 0) - 34 * dt; // Gravity
    racer.y += (racer.vy || 0) * dt;

    // Mid-air stunt trick controls
    if (!racer.stuntType && (input.drift || input.useItem || Math.abs(input.steer) > 0.45)) {
      if (input.drift) {
        racer.stuntType = 'barrel_roll';
      } else if (Math.abs(input.steer) > 0.45) {
        racer.stuntType = 'spin';
      } else {
        racer.stuntType = 'flip';
      }
      racer.stuntTimer = 0;
      racer.stuntCompleted = true;
    }

    if (racer.stuntType) {
      racer.stuntTimer = (racer.stuntTimer || 0) + dt;
      const stuntProgress = Math.min(1.0, racer.stuntTimer / 0.55);
      if (racer.stuntType === 'flip') {
        racer.stuntAngleX = stuntProgress * Math.PI * 2;
      } else if (racer.stuntType === 'spin') {
        racer.stuntAngleY = stuntProgress * Math.PI * 2 * (input.steer < 0 ? -1 : 1);
      } else if (racer.stuntType === 'barrel_roll') {
        racer.stuntAngleZ = stuntProgress * Math.PI * 2 * (input.steer < 0 ? -1 : 1);
      }
    }

    // Touchdown on road landing
    if (racer.y <= targetY && racer.vy <= 0) {
      racer.y = targetY;
      racer.vy = 0;
      racer.isAirborne = false;
      racer.stuntAngleX = 0;
      racer.stuntAngleY = 0;
      racer.stuntAngleZ = 0;

      // Reward stunt completion on landing
      if (racer.stuntCompleted) {
        racer.turboTimer = 1.6;
        racer.speed = Math.max(racer.speed + 9.5, maxBaseSpeed * 1.28);
        if (onCollision) {
          onCollision({
            type: 'stunt_boost',
            racerId: racer.id,
            x: racer.x,
            y: racer.y,
            z: racer.z,
          });
        }
      }
      racer.stuntType = null;
      racer.stuntCompleted = false;
    }
  } else {
    // Normal road surface tracking
    if (Math.abs(racer.y - targetY) < 0.02) {
      racer.y = targetY;
    } else {
      racer.y = THREE.MathUtils.lerp(racer.y, targetY, Math.min(1.0, dt * 18.0));
    }
    racer.stuntAngleX = 0;
    racer.stuntAngleY = 0;
    racer.stuntAngleZ = 0;
  }

  // Authentic 3D suspension dynamics:
  // Pitch (rotX): Road gradient slope + braking dive / acceleration squat
  const slopePitch = Math.asin(THREE.MathUtils.clamp(trackInfo.tangent.y, -0.65, 0.65));
  let targetRotX = -slopePitch;
  if (input.brake > 0 && racer.speed > 4) {
    targetRotX += 0.04 * input.brake; // Nose dive under braking
  } else if (input.throttle > 0 && racer.speed < maxBaseSpeed) {
    targetRotX -= 0.02 * input.throttle; // Rear squat on acceleration
  }
  racer.rotX = THREE.MathUtils.lerp(racer.rotX || 0, targetRotX, Math.min(1.0, dt * 10.0));

  // Roll (rotZ): Outward centrifugal body lean in corners & drift tilt
  const speedRatio = THREE.MathUtils.clamp(Math.abs(racer.speed) / (maxBaseSpeed + 0.1), 0, 1.2);
  const targetRoll = -racer.steerAngle * speedRatio * (racer.isDrifting ? 0.22 : 0.14);
  racer.rotZ = THREE.MathUtils.lerp(racer.rotZ || 0, targetRoll, dt * 14.0);

  // Wrong-Way orientation check against track tangent
  _physCarFwd.set(Math.sin(racer.rotY), 0, Math.cos(racer.rotY));
  const dot = _physCarFwd.dot(trackInfo.tangent);
  racer.isWrongWay = dot < -0.35 && racer.speed > 8;

  // Update racer surface states from track info
  racer.currentSurface = trackInfo.surface || 'asphalt';
  racer.surfaceName = trackInfo.surfaceName || 'Rannatee';
  racer.surfaceIcon = trackInfo.surfaceIcon || '🛣️';

  // Off-road terrain and surface-specific handling
  if (trackInfo.isOffroad) {
    // Off-road decelerates car to a moderate safe speed, but doesn't bounce or teleport!
    // Turbo bypasses offroad slowdown (just like Mario Kart mushroom cutting corners!)
    if (racer.turboTimer <= 0) {
      const offroadMax = 22;
      if (racer.speed > offroadMax) {
        racer.speed = Math.max(offroadMax, racer.speed - 28 * dt);
      }
    }
  } else if (trackInfo.isOnCurb) {
    // Subtle curb drag
    if (racer.turboTimer <= 0 && racer.speed > 36) {
      racer.speed -= 4.0 * dt;
    }
  } else {
    // Dynamic Road Surface Modifiers
    switch (racer.currentSurface) {
      case 'sand':
        // Soft beach sand causes slight drag unless in turbo
        if (racer.turboTimer <= 0 && racer.speed > 35) {
          racer.speed -= 7.0 * dt;
        }
        break;
      case 'ice':
        // Ice maintains momentum with minimal friction, slips in turns
        if (Math.abs(input.steer) > 0.4) {
          racer.rotY += racer.steerAngle * 0.4 * dt;
        }
        break;
      case 'wood':
        // Pier planks: rhythmic gentle rolling resistance
        if (racer.turboTimer <= 0 && racer.speed > 39) {
          racer.speed -= 3.0 * dt;
        }
        break;
      case 'cobblestone':
        // Cobblestone gives great feedback and faster mini-turbo charging
        if (racer.isDrifting) {
          racer.driftChargeTime = (racer.driftChargeTime || 0) + dt * 0.25;
        }
        break;
      case 'dirt':
        // Rally dirt: easily initiates power-slides
        if (Math.abs(input.steer) > 0.6 && racer.speed > 16) {
          racer.isDrifting = true;
        }
        break;
      case 'glass':
      case 'cyber_grid':
        // Ultra smooth high-tech surface gives a slight top speed boost
        if (racer.speed > 25 && input.throttle > 0) {
          racer.speed += 2.2 * dt;
        }
        break;
      case 'magma_rock':
        // Basalt rock: intense traction
        break;
    }
  }

  // HARD impenetrable outer boundary — physically impossible to drive into or through walls!
  {
    const half = track.trackWidth * 0.5;
    // Segment-accurate boundary: tunnels (tight), bridges, cliffs, shortcuts, and barriers
    const rawWallDist = (trackInfo as any).wallDistance || (half + 2.4);
    // Kart collision radius (~1.15m half-width/bumper): center of kart must stay at least carRadius away from the wall
    const carRadius = 1.15;
    const maxLegalDist = Math.max(half * 0.75, rawWallDist - carRadius);
    const softMax = maxLegalDist - 0.85;

    // True 2D radial offset from the closest track centerline point
    const toCarX = racer.x - trackInfo.closestPoint.x;
    const toCarZ = racer.z - trackInfo.closestPoint.z;
    const radialDist = Math.hypot(toCarX, toCarZ);

    if (radialDist > softMax) {
      const excess = radialDist - softMax;
      // Progressive friction and off-road curb resistance
      racer.speed *= Math.max(0.48, 1.0 - excess * 0.18);
    }

    if (radialDist > maxLegalDist) {
      // 1. STRICT RADIAL CLAMP: Locks vehicle body strictly inside the track boundary
      const clampedDist = maxLegalDist - 0.05;
      const dirX = toCarX / (radialDist || 0.001);
      const dirZ = toCarZ / (radialDist || 0.001);
      racer.x = trackInfo.closestPoint.x + dirX * clampedDist;
      racer.z = trackInfo.closestPoint.z + dirZ * clampedDist;

      // 2. WALL DEFLECTION & TANGENT SLIDE:
      // If car is pointed into the barrier, deflect heading parallel to track tangent so it glances off
      const fwdX = Math.sin(racer.rotY);
      const fwdZ = Math.cos(racer.rotY);
      const intoWall = fwdX * dirX + fwdZ * dirZ; // > 0 means car is driving into wall

      // Elastic inward bounce kick
      racer.x -= dirX * 0.22;
      racer.z -= dirZ * 0.22;

      if (intoWall > 0) {
        // Find whether track forward matches car forward
        const dotTan = fwdX * trackInfo.tangent.x + fwdZ * trackInfo.tangent.z;
        const targetYaw = dotTan >= 0
          ? Math.atan2(trackInfo.tangent.x, trackInfo.tangent.z)
          : Math.atan2(-trackInfo.tangent.x, -trackInfo.tangent.z);
        racer.rotY = THREE.MathUtils.lerp(racer.rotY, targetYaw, 0.65);
      }

      const prevSpeed = Math.abs(racer.speed);
      racer.speed = Math.min(racer.speed * 0.60, 14);

      if (prevSpeed > 5 && onCollision) {
        onCollision({
          type: 'wall_hit',
          racerId: racer.id,
          x: racer.x,
          y: racer.y + 0.35,
          z: racer.z,
        });
      }
    }
  }

  // Checkpoint & Lap progression
  const numCp = track.checkpoints.length;
  for (let offset = 1; offset <= 3; offset++) {
    const candidateIdx = (racer.checkpointIndex + offset) % numCp;
    const distToCp = _physCarPos.distanceTo(track.checkpoints[candidateIdx]);

    if (distToCp < 34) {
      // Crossed start/finish line to finish a lap
      if (candidateIdx === 0 && racer.checkpointIndex > numCp - 10) {
        racer.lap += 1;
        const now = Date.now();
        if (racer.currentLapStartTime > 0) {
          const lapDuration = (now - racer.currentLapStartTime) / 1000;
          racer.lapTimes.push(lapDuration);
          if (!racer.bestLapTime || lapDuration < racer.bestLapTime) {
            racer.bestLapTime = lapDuration;
          }
        }
        racer.currentLapStartTime = now;
      }
      racer.checkpointIndex = candidateIdx;
      racer.totalDistance += 20 * offset;
      break;
    }
  }

  // Boost Pad Check (Narrow strip detection)
  if (track.boostPads && racer.turboTimer <= 0) {
    for (const pad of track.boostPads) {
      const dx = racer.x - pad.x;
      const dz = racer.z - pad.z;
      const cosR = Math.cos(-pad.rotY);
      const sinR = Math.sin(-pad.rotY);
      const localX = dx * cosR - dz * sinR;
      const localZ = dx * sinR + dz * cosR;
      // Narrow pad: 3.6m width (half-width 1.8m + car margin 0.6m = 2.4m)
      if (Math.abs(localX) <= 2.4 && Math.abs(localZ) <= 2.8) {
        // Boost pad hit!
        racer.turboTimer = 1.35;
        racer.speed = Math.max(racer.speed + 10, maxBaseSpeed * 1.18);
        if (onCollision) {
          onCollision({
            type: 'boost_pad',
            racerId: racer.id,
            x: racer.x,
            y: racer.y,
            z: racer.z,
          });
        }
        break; // Only trigger one boost pad at a time
      }
    }
  }

  // Jump Ramp Check — launches car airborne with high velocity and airtime!
  if (track.jumpRamps && !racer.isAirborne) {
    for (const ramp of track.jumpRamps) {
      const dx = racer.x - ramp.x;
      const dz = racer.z - ramp.z;
      const cosR = Math.cos(-ramp.rotY);
      const sinR = Math.sin(-ramp.rotY);
      const localX = dx * cosR - dz * sinR;
      const localZ = dx * sinR + dz * cosR;
      if (Math.abs(localX) <= (ramp.width * 0.5 + 1.2) && Math.abs(localZ) <= 3.2) {
        // Launch into the air!
        racer.isAirborne = true;
        racer.vy = ramp.jumpForce || 22;
        racer.speed = Math.max(racer.speed + (ramp.boostBonus || 12), maxBaseSpeed * 1.32);
        racer.turboTimer = Math.max(racer.turboTimer, 1.4);
        racer.airTime = 0;
        racer.stuntTimer = 0;
        racer.stuntType = null;
        racer.stuntCompleted = false;
        if (onCollision) {
          onCollision({
            type: 'jump_ramp',
            racerId: racer.id,
            x: racer.x,
            y: racer.y,
            z: racer.z,
          });
        }
        break;
      }
    }
  }

  // Aerial Stunt Ring Check — fly through suspended rings for bonus mega-turbo!
  if (track.stuntRings) {
    for (const ring of track.stuntRings) {
      if (ring.collectedBy.includes(racer.id)) continue;
      const distSq = (racer.x - ring.x) ** 2 + (racer.y - ring.y) ** 2 + (racer.z - ring.z) ** 2;
      if (distSq < (ring.radius + 1.8) ** 2) {
        ring.collectedBy.push(racer.id);
        racer.turboTimer = 2.2;
        racer.speed = Math.max(racer.speed + 14, maxBaseSpeed * 1.38);
        if (onCollision) {
          onCollision({
            type: 'stunt_ring',
            racerId: racer.id,
            x: ring.x,
            y: ring.y,
            z: ring.z,
          });
        }
        break;
      }
    }
  }

  // Dynamic Interactive Track Hazards Check
  if (track.hazards && racer.spinTimer <= 0) {
    for (const hazard of track.hazards) {
      if (!hazard.active) continue;
      const dist = Math.hypot(racer.x - hazard.x, racer.y - hazard.y, racer.z - hazard.z);
      if (dist < (hazard.radius + 1.25)) {
        if (!claimHazardContact(racer, hazard)) continue;
        if (racer.starTimer > 0) {
          // Super star smashes through hazard harmlessly
          continue;
        } else if (racer.hasShield) {
          // Shield pops and protects the car
          racer.hasShield = false;
          racer.shieldTimer = 0;
        } else {
          // Hazard hit causes spinout and loss of momentum
          racer.spinTimer = 1.4;
          racer.speed = Math.min(racer.speed * 0.22, 5);
          racer.driftChargeTime = 0;
          if (onCollision) {
            onCollision({
              type: 'hazard_hit',
              racerId: racer.id,
              x: hazard.x,
              y: hazard.y,
              z: hazard.z,
              hazardName: hazard.name,
            });
          }
        }
        break;
      }
    }
  }

  // Item box pickups — HARD rule: max 1 item held; never pick while holding or on cooldown
  if (racer.itemBoxCooldown && racer.itemBoxCooldown > 0) {
    racer.itemBoxCooldown -= dt;
  }

  // Must not already hold an item (strict)
  if (racer.currentItem == null && (!racer.itemBoxCooldown || racer.itemBoxCooldown <= 0)) {
    // Horizontal-only distance (Y weighting caused missed pickups on hills/bumps)
    // Slightly larger radius + swept check so high speed doesn't skip boxes
    const hitR = 3.4;
    const hitRSq = hitR * hitR;
    let bestBox: typeof track.itemBoxes[0] | null = null;
    let bestD = hitRSq;

    for (const box of track.itemBoxes) {
      if (!box.active) continue;
      const dx = racer.x - box.x;
      const dz = racer.z - box.z;
      const dSq = dx * dx + dz * dz;
      if (dSq < bestD) {
        bestD = dSq;
        bestBox = box;
      }
    }

    if (bestBox) {
      // Only THIS box disappears — other cars can still take the other two
      bestBox.active = false;
      bestBox.respawnTime = 7;
      bestBox.mesh.visible = false;
      // Car still cannot pick a second item while holding one (currentItem check above)
      racer.itemBoxCooldown = 1.2; // brief anti-double-tap if clipping two boxes same frame
      racer.currentItem = getRandomPowerUp(Math.max(1, racer.position || 1), 6);

      if (onCollision) {
        onCollision({
          type: 'item_box',
          racerId: racer.id,
          x: bestBox.x,
          y: bestBox.y,
          z: bestBox.z,
        });
      }
    }
  }

  // Boost pad trigger (3D distance check)
  track.boostPads.forEach(pad => {
    const padDist = Math.hypot(racer.x - pad.x, (racer.y - pad.y) * 1.5, racer.z - pad.z);
    if (padDist < 4.8) {
      racer.turboTimer = 2.2;
      racer.speed = Math.max(racer.speed + 10, maxBaseSpeed * 1.34);

      if (onCollision) {
        onCollision({
          type: 'boost_pad',
          racerId: racer.id,
          x: pad.x,
          y: pad.y,
          z: pad.z,
        });
      }
    }
  });

  // Shield timer decay
  if (racer.shieldTimer > 0) {
    racer.shieldTimer -= dt;
    if (racer.shieldTimer <= 0) {
      racer.hasShield = false;
    }
  }

  // Speech bubble decay
  if (racer.speechTimer && racer.speechTimer > 0) {
    racer.speechTimer -= dt;
    if (racer.speechTimer <= 0) {
      racer.speechText = undefined;
    }
  }

  // Animation values
  racer.wheelRot += (racer.speed / 0.38) * dt;
  racer.bounceOffset = 0;
}

/**
 * Handles elastic collision between two cartoon cars (Smooth Bumping!)
 */
export function resolveCarCarCollisions(racers: RacerState[], dt: number, onCollision?: (event: CollisionEvent) => void) {
  const carRadius = 1.35;

  for (let i = 0; i < racers.length; i++) {
    for (let j = i + 1; j < racers.length; j++) {
      const a = racers[i];
      const b = racers[j];

      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const dist = Math.hypot(dx, dz);

      if (dist < carRadius * 2 && dist > 0.001) {
        const overlap = (carRadius * 2) - dist;
        const nx = dx / dist;
        const nz = dz / dist;

        // Smooth non-jittery separation
        const pushDist = Math.min(overlap * 0.5, 0.25);
        a.x -= nx * pushDist;
        a.z -= nz * pushDist;
        b.x += nx * pushDist;
        b.z += nz * pushDist;

        // Bounce relative speeds
        const relSpeed = a.speed - b.speed;
        a.speed -= relSpeed * 0.2;
        b.speed += relSpeed * 0.2;

        // Star & Shield ramming bonus!
        if (a.starTimer > 0 && !(b.starTimer > 0)) {
          b.spinTimer = 1.6;
          b.speed *= 0.15;
        } else if (b.starTimer > 0 && !(a.starTimer > 0)) {
          a.spinTimer = 1.6;
          a.speed *= 0.15;
        } else if (a.hasShield && !b.hasShield) {
          b.spinTimer = 1.2;
          b.speed *= 0.2;
        } else if (b.hasShield && !a.hasShield) {
          a.spinTimer = 1.2;
          a.speed *= 0.2;
        }

        if (onCollision && (Math.abs(relSpeed) > 6 || Math.abs(a.speed) > 15)) {
          onCollision({
            type: 'car_bump',
            racerId: a.id,
            targetId: b.id,
            x: (a.x + b.x) * 0.5,
            y: (a.y + b.y) * 0.5,
            z: (a.z + b.z) * 0.5,
          });
        }
      }
    }
  }
}

function pointToSegmentDistance(
  px: number, py: number, pz: number,
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number
): number {
  const abx = bx - ax;
  const aby = by - ay;
  const abz = bz - az;
  const apx = px - ax;
  const apy = py - ay;
  const apz = pz - az;

  const abLenSq = abx * abx + aby * aby + abz * abz;
  if (abLenSq < 1e-6) {
    return Math.hypot(px - ax, py - ay, pz - az);
  }

  const t = Math.max(0, Math.min(1, (apx * abx + apy * aby + apz * abz) / abLenSq));
  const projX = ax + t * abx;
  const projY = ay + t * aby;
  const projZ = az + t * abz;

  return Math.hypot(px - projX, py - projY, pz - projZ);
}

/**
 * Updates projectiles (Rockets, Blue Rockets, Plasma, Freeze Ray, Thunderclouds, Bananas, Mines, Vortex, Oil Slicks)
 * - Rockets: the ONLY guided/homing projectiles (follow road spline & steer towards target)
 * - Plasma Cannon: ultra-fast straight energy railgun beam that pierces through multiple cars in crosshairs
 * - Freeze Ray: short forward cone of cold; stationary cloud and persistent traps are proximity effects
 * - Swept capsule collision ensures 100% reliable hits with zero tunneling
 */
export function updateProjectiles(
  projectiles: Projectile[],
  racers: RacerState[],
  track: TrackData,
  dt: number,
  onCollision: (event: CollisionEvent) => void
) {
  const trackLength = track?.curve?.getLength() || 2700;
  const upVec = new THREE.Vector3(0, 1, 0);

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    if (!p.active) continue;

    p.life -= dt;
    if (p.life <= 0) {
      p.active = false;
      continue;
    }

    // Save previous frame position for swept continuous collision
    p.prevX = p.x;
    p.prevY = p.y;
    p.prevZ = p.z;

    if (p.type === 'rocket') {
      // Red Rocket: The ONLY homing missile (follows track curves and locks onto target ahead)
      if (p.trackT === undefined && track && track.curve) {
        const info = track.getTrackInfo(new THREE.Vector3(p.x, p.y, p.z));
        p.trackT = info.t;
        p.lateralOffset = THREE.MathUtils.clamp(info.signedDistance, -track.trackWidth * 0.42, track.trackWidth * 0.42);
      }

      let target = p.targetId ? racers.find(r => r.id === p.targetId && !r.finished) : undefined;
      if (!target) {
        // Find closest rival ahead
        let bestDist = 120;
        for (const r of racers) {
          if (r.id === p.ownerId || r.finished) continue;
          const d = Math.hypot(r.x - p.x, r.z - p.z);
          if (d < bestDist) {
            bestDist = d;
            target = r;
          }
        }
        if (target) p.targetId = target.id;
      }

      const speed = 72; // High-velocity homing missile
      if (track && track.curve && p.trackT !== undefined) {
        const stepT = (speed * dt) / trackLength;
        p.trackT = (p.trackT + stepT) % 1.0;

        const centerPt = track.curve.getPointAt(p.trackT);
        const tangent = track.curve.getTangentAt(p.trackT).normalize();
        const right = new THREE.Vector3().crossVectors(tangent, upVec).normalize();

        if (target) {
          const targetInfo = track.getTrackInfo(new THREE.Vector3(target.x, target.y, target.z));
          const targetOffset = THREE.MathUtils.clamp(targetInfo.signedDistance, -track.trackWidth * 0.44, track.trackWidth * 0.44);
          p.lateralOffset = THREE.MathUtils.lerp(p.lateralOffset || 0, targetOffset, dt * 10.0);
        }

        p.x = centerPt.x + right.x * (p.lateralOffset || 0);
        p.y = centerPt.y + 0.65;
        p.z = centerPt.z + right.z * (p.lateralOffset || 0);
        p.vx = tangent.x * speed;
        p.vy = tangent.y * speed;
        p.vz = tangent.z * speed;
      } else {
        if (target) {
          const toTarget = new THREE.Vector3(target.x - p.x, target.y + 0.5 - p.y, target.z - p.z).normalize();
          p.vx = THREE.MathUtils.lerp(p.vx, toTarget.x * speed, dt * 8);
          p.vy = THREE.MathUtils.lerp(p.vy, toTarget.y * speed, dt * 8);
          p.vz = THREE.MathUtils.lerp(p.vz, toTarget.z * speed, dt * 8);
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
      }

      // Robust swept collision check (3.8m hit radius)
      for (const racer of racers) {
        if (racer.id === p.ownerId && p.life > 3.8) continue; // brief launch grace

        const dist = pointToSegmentDistance(
          racer.x, racer.y + 0.5, racer.z,
          p.prevX, p.prevY, p.prevZ,
          p.x, p.y, p.z
        );

        if (dist < 3.8) {
          p.active = false;

          if (racer.starTimer > 0) {
            // Star deflecting
          } else if (racer.hasShield) {
            racer.hasShield = false;
            racer.shieldTimer = 0;
          } else {
            racer.spinTimer = 1.8;
            racer.speed *= 0.15;
          }

          onCollision({
            type: 'rocket_hit',
            racerId: p.ownerId,
            targetId: racer.id,
            x: racer.x,
            y: racer.y + 0.5,
            z: racer.z,
          });
          break;
        }
      }
    } else if (p.type === 'blue_rocket') {
      // Blue Rocket: relentless 1st place leader hunter along track centerline
      if (p.trackT === undefined && track && track.curve) {
        const info = track.getTrackInfo(new THREE.Vector3(p.x, p.y, p.z));
        p.trackT = info.t;
        p.lateralOffset = 0;
      }

      let target = racers.find(r => r.position === 1 && r.id !== p.ownerId && !r.finished);
      if (!target) {
        target = racers.find(r => r.position === 2 && r.id !== p.ownerId && !r.finished);
      }
      if (!target) {
        target = racers.find(r => r.id !== p.ownerId && !r.finished);
      }

      const chaseSpeed = 96;
      if (track && track.curve && p.trackT !== undefined) {
        const stepT = (chaseSpeed * dt) / trackLength;
        p.trackT = (p.trackT + stepT) % 1.0;

        const centerPt = track.curve.getPointAt(p.trackT);
        const tangent = track.curve.getTangentAt(p.trackT).normalize();

        let distToTarget = 999;
        if (target) {
          distToTarget = Math.hypot(target.x - centerPt.x, target.z - centerPt.z);
        }

        if (target && distToTarget < 24.0) {
          // Dive directly onto leader car
          p.x = THREE.MathUtils.lerp(p.x, target.x, dt * 16);
          p.z = THREE.MathUtils.lerp(p.z, target.z, dt * 16);
          p.y = THREE.MathUtils.lerp(p.y, target.y + 0.6, dt * 12);
        } else {
          p.x = centerPt.x;
          p.y = centerPt.y + 1.8 + Math.sin(p.life * 12) * 0.2;
          p.z = centerPt.z;
        }

        p.vx = tangent.x * chaseSpeed;
        p.vy = tangent.y * chaseSpeed;
        p.vz = tangent.z * chaseSpeed;

        if (target && distToTarget < 3.8) {
          p.active = false;

          // Mega explosion blast on leader!
          if (!(target.starTimer > 0)) {
            if (target.hasShield) {
              target.hasShield = false;
              target.shieldTimer = 0;
            } else {
              target.spinTimer = 2.8;
              target.speed = 0;
            }
          }

          // Splash damage nearby cars (8.5m radius)
          for (const other of racers) {
            if (other.id === target.id) continue;
            const splashDist = Math.hypot(other.x - p.x, other.z - p.z);
            if (splashDist < 8.5 && !(other.starTimer > 0)) {
              if (other.hasShield) {
                other.hasShield = false;
                other.shieldTimer = 0;
              } else {
                other.spinTimer = 1.6;
                other.speed *= 0.3;
              }
            }
          }

          onCollision({
            type: 'blue_rocket_hit',
            racerId: p.ownerId,
            targetId: target.id,
            x: target.x,
            y: target.y + 0.6,
            z: target.z,
          });
        }
      } else {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
      }
    } else if (p.type === 'plasma_cannon') {
      // A world-space energy beam keeps its launch heading; no spline steering or ricochets.
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;

      p.hitIds = p.hitIds || [];

      for (const racer of racers) {
        if (racer.finished) continue;
        if (racer.id === p.ownerId) continue;
        if (p.hitIds.includes(racer.id)) continue; // already pierced this racer

        const dist = pointToSegmentDistance(
          racer.x, racer.y + 0.5, racer.z,
          p.prevX, p.prevY, p.prevZ,
          p.x, p.y, p.z
        );
        // A narrow swept energy beam requires real aim.
        if (dist < 1.6) {
          p.hitIds.push(racer.id);

          if (racer.starTimer > 0) {
            // Invincible
          } else if (racer.hasShield) {
            racer.hasShield = false;
            racer.shieldTimer = 0;
          } else {
            // High-voltage plasma shock: 1.6s spinout, speed slashed to 20%
            racer.spinTimer = 1.6;
            racer.speed *= 0.2;
          }

          onCollision({
            type: 'plasma_hit',
            racerId: p.ownerId,
            targetId: racer.id,
            x: racer.x,
            y: racer.y + 0.5,
            z: racer.z,
          });
        }
      }
    } else if (p.type === 'freezeray') {
      // Short cone-shaped cryogenic burst. It expands from the muzzle and never flies around corners.
      p.hitIds ||= [];
      const radius = Math.min(14, (0.45 - p.life) * 70);
      for (const racer of racers) {
        if (racer.finished || racer.id === p.ownerId || p.hitIds.includes(racer.id)) continue;
        if (!isInCryoCone(p, racer, radius)) continue;
        p.hitIds.push(racer.id);
        if (racer.starTimer > 0) continue;
        if (racer.hasShield) { racer.hasShield = false; racer.shieldTimer = 0; }
        else { racer.frozenTimer = 2.5; racer.speed *= 0.55; }
        onCollision({ type: 'freezeray_hit', racerId: p.ownerId, targetId: racer.id, x: racer.x, y: racer.y + 0.5, z: racer.z });
      }
    } else if (p.type === 'thundercloud') {
      // A stationary proximity storm: warn before striking cars still underneath it.
      p.state ||= 'idle';
      const nearby = racers.filter(r => !r.finished && r.id !== p.ownerId && Math.hypot(r.x - p.x, r.z - p.z) < 7 && Math.abs(r.y + 2.5 - p.y) < 4);
      if (p.state === 'idle' && nearby.length) { p.state = 'striking'; p.timer = 0.65; }
      if (p.state === 'striking') {
        p.timer = (p.timer ?? 0.65) - dt;
        if (p.timer <= 0) {
          p.active = false;
          for (const target of nearby) {
            if (target.starTimer > 0) continue;
            if (target.hasShield) { target.hasShield = false; target.shieldTimer = 0; }
            else { target.frozenTimer = 2; target.speed *= 0.45; }
            onCollision({ type: 'thundercloud_strike', racerId: p.ownerId, targetId: target.id, x: target.x, y: target.y, z: target.z });
          }
        }
      }
    } else if (p.type === 'banana') {
      // Stationary banana peel trap: triggers spinout on anyone who runs over it
      for (const racer of racers) {
        if (racer.id === p.ownerId && p.life > 28.5) continue; // 1.5s grace for dropper

        const dist = pointToSegmentDistance(
          racer.x, racer.y + 0.3, racer.z,
          p.prevX, p.prevY, p.prevZ,
          p.x, p.y, p.z
        );

        if (dist < 2.5) {
          p.active = false;

          if (racer.starTimer > 0) {
            // Squashed harmlessly
          } else if (racer.hasShield) {
            racer.hasShield = false;
            racer.shieldTimer = 0;
          } else {
            racer.spinTimer = 1.8; // 360 degree spinout
            racer.speed *= 0.35;
          }

          onCollision({
            type: 'banana_hit',
            racerId: p.ownerId,
            targetId: racer.id,
            x: p.x,
            y: p.y,
            z: p.z,
          });
          break;
        }
      }
    } else if (p.type === 'mine') {
      // Explosive TNT bomb
      for (const racer of racers) {
        if (racer.id === p.ownerId && p.life > 14.5) continue;

        const dist = pointToSegmentDistance(
          racer.x, racer.y + 0.3, racer.z,
          p.prevX, p.prevY, p.prevZ,
          p.x, p.y, p.z
        );

        if (dist < 2.8) {
          p.active = false;

          if (racer.starTimer > 0) {
            // Immune
          } else if (racer.hasShield) {
            racer.hasShield = false;
            racer.shieldTimer = 0;
          } else {
            racer.spinTimer = 2.2;
            racer.speed *= 0.1;
          }

          onCollision({
            type: 'mine_hit',
            racerId: p.ownerId,
            targetId: racer.id,
            x: p.x,
            y: p.y,
            z: p.z,
          });
          break;
        }
      }
    } else if (p.type === 'vortex') {
      p.hitIds ||= [];
      // Gravitational singularity: pulls nearby racers into its event horizon
      (p as any).absorbed = (p as any).absorbed || 0;

      for (const racer of racers) {
        if (racer.finished) continue;
        if (racer.id === p.ownerId || p.hitIds!.includes(racer.id)) continue;

        const dx = p.x - racer.x;
        const dz = p.z - racer.z;
        const dist = Math.hypot(dx, dz);

        if (dist < 18.0 && !(racer.starTimer > 0)) {
          // Strong inward gravitational pull
          const pullIntensity = (1.0 - dist / 18.0) * 20.0 * dt;
          racer.x += (dx / Math.max(dist, 0.05)) * pullIntensity;
          racer.z += (dz / Math.max(dist, 0.05)) * pullIntensity;

          // Event horizon entrapment!
          if (dist < 2.8) {
            p.hitIds!.push(racer.id);
            if (racer.hasShield) {
              racer.hasShield = false;
              racer.shieldTimer = 0;
            } else {
              racer.spinTimer = Math.max(racer.spinTimer || 0, 2.2);
              racer.speed *= 0.15;
            }

            onCollision({
              type: 'vortex_suck',
              racerId: p.ownerId,
              targetId: racer.id,
              x: p.x,
              y: p.y + 0.4,
              z: p.z,
            });

            (p as any).absorbed++;
            if ((p as any).absorbed >= 2) {
              p.active = false;
              break;
            }
          }
        }
      }
    } else if (p.type === 'oil_slick') {
      p.hitIds ||= [];
      // Slippery black rainbow-sheened oil slick trap on the track
      (p as any).slipCount = (p as any).slipCount || 0;

      for (const racer of racers) {
        if (racer.finished) continue;
        if (racer.id === p.ownerId || p.hitIds!.includes(racer.id)) continue;

        const dist = Math.hypot(racer.x - p.x, racer.z - p.z);
        if (dist < 3.2) {
          p.hitIds!.push(racer.id);
          if (racer.starTimer > 0) {
            // Invincible, burns through oil
          } else {
            // Uncontrollable 720° double-spin, massive loss of traction
            racer.spinTimer = Math.max(racer.spinTimer || 0, 2.4);
            racer.speed *= 0.45;
          }

          onCollision({
            type: 'oil_slip',
            racerId: p.ownerId,
            targetId: racer.id,
            x: p.x,
            y: p.y + 0.1,
            z: p.z,
          });

          (p as any).slipCount++;
          if ((p as any).slipCount >= 3) {
            p.active = false;
            break;
          }
        }
      }
    }
  }
}


/**
 * Arcade slipstream: slight speed bonus when drafting behind another car
 */
export function applySlipstream(racers: RacerState[], dt: number) {
  for (let i = 0; i < racers.length; i++) {
    const r = racers[i];
    if (r.finished || r.spinTimer > 0) continue;
    let best = 0;
    for (let j = 0; j < racers.length; j++) {
      if (i === j) continue;
      const o = racers[j];
      const dx = o.x - r.x;
      const dz = o.z - r.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 3.5 || dist > 14) continue;
      // Other should be roughly ahead of us
      const fwdX = Math.sin(r.rotY);
      const fwdZ = Math.cos(r.rotY);
      const dot = (dx * fwdX + dz * fwdZ) / dist;
      if (dot < 0.65) continue; // not in front cone
      best = Math.max(best, 1 - (dist - 3.5) / 10.5);
    }
    if (best > 0.05) {
      r.speed += 6.5 * best * dt;
      (r as any).inSlipstream = true;
    } else {
      (r as any).inSlipstream = false;
    }
  }
}

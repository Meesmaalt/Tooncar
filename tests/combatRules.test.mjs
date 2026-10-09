import {test} from 'node:test';
import assert from 'node:assert/strict';
import {stepHazardContacts, claimHazardContact, isInCryoCone} from '../src/game/combatRules.ts';

test('hazards cannot re-trigger a stationary victim, even after spin and cooldown expire',()=>{
  const racer={x:0,y:0,z:0}, hazard={id:'spout',x:0,y:0,z:0,radius:3};
  stepHazardContacts(racer,[hazard],0);
  assert.equal(claimHazardContact(racer,hazard),true);
  for(let i=0;i<600;i++){stepHazardContacts(racer,[hazard],1/60);assert.equal(claimHazardContact(racer,hazard),false);}
  racer.x=8;stepHazardContacts(racer,[hazard],1/60);
  racer.x=0;assert.equal(claimHazardContact(racer,hazard),true);
});
test('overlapping hazards grant recovery time and latch blocked contacts',()=>{
  const racer={x:0,y:0,z:0}, a={id:'a',x:0,y:0,z:0,radius:3},b={...a,id:'b'};
  stepHazardContacts(racer,[a,b],0);
  assert.equal(claimHazardContact(racer,a),true);assert.equal(claimHazardContact(racer,b),false);
  stepHazardContacts(racer,[a,b],4);assert.equal(claimHazardContact(racer,b),false);
});
test('cryo spray covers a limited forward cone, rejects rear cars and other bridge levels',()=>{
  const p={x:0,y:1,z:0,vx:0,vz:1};
  assert.equal(isInCryoCone(p,{x:2,y:0,z:10},14),true);
  for(const t of [{x:0,y:0,z:-5},{x:10,y:0,z:3},{x:0,y:0,z:15},{x:0,y:15,z:5}])assert.equal(isInCryoCone(p,t,14),false);
});

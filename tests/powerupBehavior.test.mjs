import {test, after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
const {updateProjectiles}=await server.ssrLoadModule('/src/game/physics.ts');
after(()=>server.close());
const track={curve:{getLength:()=>1500,getPointAt:()=>{throw Error('non-rocket followed the track');}},getTrackInfo:()=>{throw Error('non-rocket snapped to road');}};
const racer=(id,x,z)=>({id,x,y:0,z,speed:20,spinTimer:0,frozenTimer:0,starTimer:0,hasShield:false,finished:false});
const projectile=type=>({id:type,type,ownerId:'owner',x:0,y:0.5,z:0,vx:140,vy:0,vz:0,life:0.65,active:true});

test('plasma follows launch heading, pierces aligned cars once and misses other lanes',()=>{
  const p=projectile('plasma_cannon'), a=racer('a',12,0),b=racer('b',24,0),c=racer('c',12,5),owner=racer('owner',1,0),events=[];
  updateProjectiles([p],[a,b,c,owner],track,0.2,e=>events.push(e));
  assert.equal(p.x,28);assert.equal(p.z,0);assert.equal(p.vx,140);
  assert.deepEqual(events.map(e=>e.targetId),['a','b']);assert.equal(c.speed,20);assert.equal(owner.speed,20);
  updateProjectiles([p],[a,b,c,owner],track,0.1,e=>events.push(e));assert.equal(events.length,2);
});
test('cryo stays at muzzle, applies slow once in forward fan and never spins its targets',()=>{
  const p={...projectile('freezeray'),vx:0,vz:1,life:0.45},front=racer('front',1,8),rear=racer('rear',0,-5),events=[];
  updateProjectiles([p],[front,rear],track,0.2,e=>events.push(e));
  assert.equal(p.x,0);assert.equal(p.z,0);assert.equal(front.frozenTimer,2.5);assert.equal(front.spinTimer,0);assert.equal(rear.speed,20);
  front.frozenTimer=2.4;updateProjectiles([p],[front,rear],track,0.1,e=>events.push(e));assert.equal(front.frozenTimer,2.4);assert.equal(events.length,1);
});
test('vortex cannot recapture the same victim or spend both charges on one car',()=>{
  const p={...projectile('vortex'),vx:0,life:9.5},target=racer('victim',1,0),events=[];
  updateProjectiles([p],[target],track,1/60,e=>events.push(e));
  const x=target.x,speed=target.speed;
  for(let i=0;i<120;i++){target.spinTimer=Math.max(0,target.spinTimer-1/60);updateProjectiles([p],[target],track,1/60,e=>events.push(e));}
  assert.equal(events.length,1);assert.equal(target.x,x);assert.equal(target.speed,speed);assert.ok(target.spinTimer<0.3);assert.equal(p.active,true);
});
test('oil slick affects each driver only once',()=>{
  const p={...projectile('oil_slick'),life:35},target=racer('victim',1,0),events=[];
  for(let i=0;i<60;i++)updateProjectiles([p],[target],track,1/60,e=>events.push(e));
  assert.equal(events.length,1);assert.equal(target.speed,9);assert.equal(p.active,true);
});
test('storm remains stationary and can be escaped during its warning',()=>{
  const p={...projectile('thundercloud'),y:2.5,vx:0,life:60},target=racer('victim',2,0),events=[];
  updateProjectiles([p],[target],track,0.1,e=>events.push(e));assert.equal(p.state,'striking');assert.equal(p.x,0);
  target.x=20;updateProjectiles([p],[target],track,0.6,e=>events.push(e));assert.equal(p.x,0);assert.equal(events.length,0);assert.equal(target.speed,20);assert.equal(p.active,false);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { CIRCUITS, createCircuitCurve } from '../src/game/circuitLayouts.ts';
const server = await createServer({server:{middlewareMode:true,ws:{port:24679}},appType:'custom'});
const { recoverRacer } = await server.ssrLoadModule('/src/game/recovery.ts');
const { createTerrainGeometry } = await server.ssrLoadModule('/src/game/terrain.ts');
await server.close();

for (const [theme, points] of Object.entries(CIRCUITS)) {
  test(`${theme}: recovery aligns with road, avoids a blocked checkpoint and clears airborne state`, () => {
    const curve = createCircuitCurve(points);
    const checkpoints = Array.from({length:48}, (_,i)=>curve.getPointAt(i/48));
    const cp = checkpoints[13];
    const track = {curve, checkpoints, hazards:[{...cp,radius:9}], jumpRamps:[],
      getTrackInfo:p=>({closestIndex:195,surface:'asphalt',surfaceName:'Road',surfaceIcon:'road'})};
    const racer = {checkpointIndex:13,lap:2,totalDistance:300,x:999,y:-9,z:999,centerlineIndex:710,
      spinTimer:2, frozenTimer:3, turboTimer:4, isAirborne:true,vy:25,isDrifting:true,driftChargeTime:2,steerAngle:0.8,stuntCompleted:true};
    recoverRacer(racer,track);
    assert.ok(Math.hypot(racer.x-cp.x,racer.z-cp.z)>12,'spawn inside hazard');
    const tangent=curve.getTangentAt(racer.trackT), center=curve.getPointAt(racer.trackT);
    assert.ok(Math.sin(racer.rotY)*tangent.x+Math.cos(racer.rotY)*tangent.z>0.96);
    assert.ok(Math.hypot(racer.x-center.x,racer.z-center.z)<=7.01);
    assert.equal(racer.y,center.y);assert.equal(racer.centerlineIndex,195);
    for(const key of ['spinTimer','frozenTimer','turboTimer','vy','steerAngle','driftChargeTime'])assert.equal(racer[key],0);
    assert.equal(racer.isAirborne,false);assert.equal(racer.stuntCompleted,false);
    assert.equal(racer.checkpointIndex,13);assert.equal(racer.lap,2);assert.equal(racer.totalDistance,300);
  });
}

test('new racers do not reset behind finish line; nearby cars and traps are avoided',()=>{
  const curve=createCircuitCurve(CIRCUITS.beach), checkpoints=Array.from({length:48},(_,i)=>curve.getPointAt(i/48));
  const track={curve,checkpoints,hazards:[],jumpRamps:[],getTrackInfo:()=>({closestIndex:0})};
  const racer={checkpointIndex:0,trackT:0.99};
  recoverRacer(racer,track,[{x:0,y:0,z:0,radius:2}]);
  assert.equal(racer.trackT,0);assert.ok(Math.abs(racer.x)>=5);const tangent=curve.getTangentAt(0);assert.ok(Math.abs(racer.x*tangent.x+racer.z*tangent.z)<0.001);
});

test('terrain supports elevated road verges and remains finite',()=>{
  const curve=createCircuitCurve(CIRCUITS.ice);
  const centerlinePoints=Array.from({length:720},(_,i)=>{const point=curve.getPointAt(i/720),tangent=curve.getTangentAt(i/720);return{point,tangent,right:{x:tangent.z,z:-tangent.x}};});
  const geometry=createTerrainGeometry({centerlinePoints});
  const positions=geometry.attributes.position;
  let nearRaisedRoad=0;
  for(let i=0;i<positions.count;i++){
    const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);assert.ok(Number.isFinite(x+y+z));
    const cp=centerlinePoints.reduce((best,p)=>Math.hypot(p.point.x-x,p.point.z-z)<Math.hypot(best.point.x-x,best.point.z-z)?p:best);
    if(cp.point.y>20 && Math.hypot(cp.point.x-x,cp.point.z-z)<20){assert.ok(Math.abs(y-(cp.point.y-0.24))<0.6);nearRaisedRoad++;}
  }
  assert.ok(nearRaisedRoad>20);geometry.dispose();
});

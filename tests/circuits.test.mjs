import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CIRCUITS, createCircuitCurve } from '../src/game/circuitLayouts.ts';

for (const [theme, points] of Object.entries(CIRCUITS)) {
  test(`${theme}: closed driveable circuit with forward start and no crossings`, () => {
    const curve = createCircuitCurve(points);
    assert.ok(curve.getPoint(0).distanceTo(curve.getPoint(1)) < 1e-6);
    assert.ok(curve.getTangentAt(0).z > 0.98, 'start grid must face +Z');
    assert.ok(curve.getLength() > 1100 && curve.getLength() < 2600);
    const step = curve.getLength() / 1000;
    for (let i = 0; i < 1000; i++) {
      const turn = curve.getTangentAt(i / 1000).angleTo(curve.getTangentAt(((i + 1) % 1000) / 1000));
      assert.ok(step / Math.max(turn, 0.0001) > 10, 'corner folds the 22m road onto itself');
    }
    const samples = Array.from({length: 400}, (_, i) => curve.getPointAt(i / 400));
    const orient = (a,b,c) => (b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
    for (let i = 0; i < samples.length; i++) {
      const a = samples[i], b = samples[(i+1)%400];
      assert.ok(Number.isFinite(a.x+a.y+a.z));
      assert.ok(Math.abs(curve.getTangentAt(i / 400).y) < 0.25, 'unreasonable road grade');
      for (let j = i+2; j < 400; j++) {
        if (i === 0 && j === 399) continue;
        const c=samples[j], d=samples[(j+1)%400];
        assert.ok(!(orient(a,b,c)*orient(a,b,d)<0 && orient(c,d,a)*orient(c,d,b)<0), `road crosses itself at ${i},${j}`);
      }
    }
  });
}

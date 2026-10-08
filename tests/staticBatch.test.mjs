import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import { batchStaticScenery } from '../src/game/staticBatch.ts';

test('batch preserves nested world transforms and excludes animated hierarchies',()=>{
  const root=new THREE.Group();root.position.set(30,0,20);root.matrixAutoUpdate=false;root.updateMatrix();
  const geometry=new THREE.BoxGeometry(), material=new THREE.MeshStandardMaterial();
  const branch=new THREE.Group();branch.position.set(3,2,1);branch.matrixAutoUpdate=false;branch.updateMatrix();root.add(branch);
  const expected=[];
  for(let i=0;i<6;i++){
    const mesh=new THREE.Mesh(geometry,material);mesh.position.set(i*2,0,0);mesh.matrixAutoUpdate=false;mesh.updateMatrix();branch.add(mesh);
    expected.push(new THREE.Vector3(33+i*2,2,21));
  }
  const moving=new THREE.Group();root.add(moving);
  const animated=new THREE.Mesh(geometry,material);animated.matrixAutoUpdate=false;moving.add(animated);
  batchStaticScenery(root);
  const batches=root.children.filter(x=>x instanceof THREE.InstancedMesh);
  assert.equal(batches.length,1);assert.equal(batches[0].count,6);assert.equal(animated.parent,moving);
  root.updateWorldMatrix(true,true);
  const matrix=new THREE.Matrix4();
  for(let i=0;i<6;i++){
    batches[0].getMatrixAt(i,matrix);matrix.premultiply(batches[0].matrixWorld);
    assert.ok(new THREE.Vector3().setFromMatrixPosition(matrix).distanceTo(expected[i])<1e-6);
  }
});

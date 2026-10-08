import * as THREE from 'three';

/** Instance repeated, frozen scenery in spatial cells; animated hierarchies stay intact. */
export function batchStaticScenery(root: THREE.Object3D): void {
  root.updateWorldMatrix(true, true);
  const buckets = new Map<string, THREE.Mesh[]>();
  root.traverse(object => {
    if (!(object instanceof THREE.Mesh) || object instanceof THREE.InstancedMesh || Array.isArray(object.material)) return;
    let ancestor: THREE.Object3D | null = object;
    while (ancestor) {
      if (ancestor.matrixAutoUpdate) return;
      if (ancestor === root) break;
      ancestor = ancestor.parent;
    }
    const position = new THREE.Vector3().setFromMatrixPosition(object.matrixWorld);
    const key = `${object.geometry.uuid}:${object.material.uuid}:${object.castShadow}:${object.receiveShadow}:${Math.floor(position.x / 160)}:${Math.floor(position.z / 160)}`;
    const bucket = buckets.get(key) || [];
    bucket.push(object);
    buckets.set(key, bucket);
  });
  const inverseRoot = root.matrixWorld.clone().invert();
  for (const meshes of buckets.values()) {
    if (meshes.length < 4) continue;
    const first = meshes[0];
    const batch = new THREE.InstancedMesh(first.geometry, first.material, meshes.length);
    batch.castShadow = first.castShadow;
    batch.receiveShadow = first.receiveShadow;
    batch.name = 'static-scenery-batch';
    for (let i = 0; i < meshes.length; i++) {
      batch.setMatrixAt(i, new THREE.Matrix4().multiplyMatrices(inverseRoot, meshes[i].matrixWorld));
      meshes[i].removeFromParent();
    }
    batch.computeBoundingSphere();
    root.add(batch);
  }
}

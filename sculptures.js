import * as THREE from './assets/three.module.min.js';

// Geometry is separate from rendering so every model can be validated without WebGL.
export function createSculptures(environment = null) {
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xe1e2ec, metalness: 1, roughness: .17, envMap: environment, envMapIntensity: 1.8, clearcoat: 1 });
  const orange = new THREE.MeshPhysicalMaterial({ color: 0x9edbd4, metalness: .3, roughness: .23, clearcoat: 1, envMap: environment, envMapIntensity: .6 });
  const cobalt = new THREE.MeshPhysicalMaterial({ color: 0xb7a7ed, metalness: .4, roughness: .2, clearcoat: 1, envMap: environment });
  const groups = { orbit: new THREE.Group(), network: new THREE.Group(), wave: new THREE.Group() };
  const bloom = groups.orbit;
  const petalGeometry = new THREE.TorusGeometry(.79, .19, 24, 96);
  for (let i = 0; i < 8; i++) {
    const angle = i / 8 * Math.PI * 2;
    const petal = new THREE.Mesh(petalGeometry, i % 4 === 0 ? orange : chrome);
    petal.scale.set(.38, .95, .7);
    petal.rotation.set(.25 * Math.sin(angle), .3 * Math.cos(angle), angle);
    petal.position.set(-Math.sin(angle) * .55, Math.cos(angle) * .55, Math.sin(angle * 2) * .25);
    bloom.add(petal);
  }
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.39, 2), cobalt); bloom.add(core);
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.72, .014, 8, 128), cobalt); orbit.rotation.set(1.1, .4, -.3); bloom.add(orbit);
  const satellite = new THREE.Mesh(new THREE.OctahedronGeometry(.19), orange); satellite.position.set(1.45, .9, .2); satellite.rotation.z = .3; bloom.add(satellite);
  function link(a, b, radius, material) {
    const direction = new THREE.Vector3().subVectors(b, a);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 8), material);
    mesh.position.copy(a).add(b).multiplyScalar(.5); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()); return mesh;
  }
  const strands = [[], []];
  for (let i = 0; i < 15; i++) {
    const y = (i / 14 - .5) * 2.8, angle = i / 14 * Math.PI * 2.4;
    const a = new THREE.Vector3(Math.cos(angle) * .8, y, Math.sin(angle) * .8);
    const b = new THREE.Vector3(-a.x, y, -a.z);
    [a, b].forEach((p, j) => { strands[j].push(p); const sphere = new THREE.Mesh(new THREE.SphereGeometry(.115, 16, 16), j ? cobalt : orange); sphere.position.copy(p); groups.network.add(sphere); });
    groups.network.add(link(a, b, .026, chrome));
  }
  strands.forEach(points => groups.network.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 120, .036, 8, false), chrome)));
  groups.network.rotation.z = -.38;
  for (let i = 0; i < 9; i++) {
    const points = [];
    for (let j = 0; j <= 70; j++) { const x = (j / 70 - .5) * 3.1; points.push(new THREE.Vector3(x, Math.sin(x * 2.1 + i * .2) * .54 + (i - 4) * .17, Math.cos(x * 2 + i * .2) * .35)); }
    groups.wave.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 90, .048, 10, false), i % 4 === 0 ? orange : i % 4 === 2 ? cobalt : chrome));
    [points[0], points.at(-1)].forEach(p => { const endpoint = new THREE.Mesh(new THREE.SphereGeometry(.065, 12, 12), orange); endpoint.position.copy(p); groups.wave.add(endpoint); });
  }
  groups.wave.rotation.z = -.22;
  const objects = [];
  Object.values(groups).forEach(group => group.children.forEach((mesh, i) => {
    mesh.userData.base = mesh.position.clone();
    mesh.userData.direction = mesh.position.length() > .1 ? mesh.position.clone().normalize() : new THREE.Vector3(Math.sin(i * 2.4), Math.cos(i * 1.7), Math.sin(i)).normalize();
    objects.push(mesh);
  }));
  return { groups, objects };
}

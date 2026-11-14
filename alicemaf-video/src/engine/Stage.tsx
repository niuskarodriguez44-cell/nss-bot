import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {FPS, colors} from '../brand/tokens';
import {SCENES} from '../timeline';
import {N, R1, R2, clamp, lerp, ex, P, Formation} from './rand';
import {formations} from '../scenes';

const A: P = {x: 0, y: 0, z: 0, s: 0, c: 0, a: 0};
const B: P = {x: 0, y: 0, z: 0, s: 0, c: 0, a: 0};

export const evalAt = (sec: number, i: number, o: P) => {
  let k = 0;
  for (let j = 0; j < SCENES.length; j++) if (sec >= SCENES[j].start) k = j;
  const next = SCENES[k + 1];
  const f: Formation = formations[k];
  f(i, Math.max(0, sec - SCENES[k].start), o);
  if (next && next.tr > 0 && sec >= next.start - next.tr) {
    const u = (sec - (next.start - next.tr)) / next.tr;
    const ue = ex(clamp(u * 1.6 - R1[i] * 0.6));
    A.x = o.x; A.y = o.y; A.z = o.z; A.s = o.s; A.c = o.c; A.a = o.a;
    formations[k + 1](i, 0, B);
    const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) + 1e-6;
    const curl = Math.sin(Math.PI * ue) * d * 0.22 * (R2[i] - 0.5) * 2;
    o.x = lerp(A.x, B.x, ue) + (-dy / d) * curl;
    o.y = lerp(A.y, B.y, ue) + (dx / d) * curl;
    o.z = lerp(A.z, B.z, ue);
    o.s = lerp(A.s, B.s, ue); o.c = lerp(A.c, B.c, ue); o.a = lerp(A.a, B.a, ue);
  }
};

const makeTexture = () => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.18, 'rgba(255,255,255,0.9)');
  r.addColorStop(0.45, 'rgba(255,255,255,0.22)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
};

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const {mesh, tex} = useMemo(() => {
    const tex = makeTexture();
    const mat = new THREE.MeshBasicMaterial({map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending});
    const mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), mat, N);
    mesh.frustumCulled = false;
    mesh.setColorAt(0, new THREE.Color(1, 1, 1));
    return {mesh, tex};
  }, []);
  const ind = useMemo(() => new THREE.Color(colors.indigo), []);
  const cy = useMemo(() => new THREE.Color(colors.cyan), []);
  const d = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);
  const o: P = {x: 0, y: 0, z: 0, s: 0, c: 0, a: 0};
  const p: P = {x: 0, y: 0, z: 0, s: 0, c: 0, a: 0};
  const sec = frame / FPS;
  for (let i = 0; i < N; i++) {
    evalAt(sec, i, o);
    evalAt(Math.max(0, sec - 1 / FPS), i, p);
    const vx = o.x - p.x, vy = o.y - p.y, vz = o.z - p.z;
    const v = Math.hypot(vx, vy, vz);
    const stretch = 1 + clamp(v * 11, 0, 4.5); // se estiran al viajar, se contraen al asentarse
    d.position.set(o.x, o.y, o.z);
    d.rotation.set(0, 0, v > 0.004 ? Math.atan2(vy, vx) : 0);
    const size = o.s * 4.2;
    d.scale.set(size * stretch, size * (1 - 0.35 * (1 - 1 / stretch)), 1);
    d.updateMatrix();
    mesh.setMatrixAt(i, d.matrix);
    col.copy(ind).lerp(cy, clamp(o.c)).multiplyScalar(clamp(o.a, 0, 1.2) * 0.82);
    mesh.setColorAt(i, col);
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  void tex;
  return <primitive object={mesh} />;
};

export const Stage: React.FC<{width: number; height: number}> = ({width, height}) => (
  <ThreeCanvas width={width} height={height} camera={{fov: 35, position: [0, 0, 15.86]}} style={{position: 'absolute', inset: 0}}>
    <Particles />
  </ThreeCanvas>
);

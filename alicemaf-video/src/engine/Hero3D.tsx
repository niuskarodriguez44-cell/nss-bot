import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {FPS, colors} from '../brand/tokens';
import {clamp, ex, lerp} from './rand';

// Versión nativa de Remotion/R3F del plano hero de AIRE MoE (misma composición y cámara que blender/glass_hero.py).
// Mapeo Blender → three: (x, y, z) → (x, z, -y).
export const HERO_START = 63, HERO_END = 80;
const ADD = {blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.ZeroFactor} as const;
const PANELS = [-3.2, -1.1, 1.1, 3.2];
const LIT_AT = [67.8, 70.9, 74.0];

export const heroCamera = (sec: number): {pos: [number, number, number]; look: [number, number, number]} => {
  const u = clamp((sec - HERO_START) / (HERO_END - HERO_START));
  const a = ((-36 + 12 * u) * Math.PI) / 180, d = 14 - 3 * u;
  return {pos: [Math.sin(a) * d, 2.2 - 0.4 * u, Math.cos(a) * d], look: [-1.7, 0.3, 0]};
};

export const Hero3D: React.FC = () => {
  const sec = useCurrentFrame() / FPS;
  const geo = useMemo(() => {
    const threads: THREE.BufferGeometry[] = [];
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let k = 0; k < 34; k++) {
      const y0 = (rnd() - 0.5) * 5.6, z0 = rnd() * 3.6 - 1.4, pts: THREE.Vector3[] = [];
      for (let s = 0; s <= 40; s++) {
        const x = -9 + s * 0.45, sq = 1 - 0.86 * Math.exp(-(x * x) / 7);
        pts.push(new THREE.Vector3(x, z0 * sq + 0.2, -(y0 * sq + 0.08 * Math.sin(x * 1.3 + k))));
      }
      threads.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.011, 4, false));
    }
    return {threads};
  }, []);
  if (sec < HERO_START || sec > HERO_END) return null;
  const t = sec - HERO_START;
  const fadeEnd = 1 - ex(clamp((sec - (HERO_END - 1.2)) / 1.2));
  return (
    <group>
      {geo.threads.map((g, k) => (
        <mesh key={k} geometry={g}>
          <meshBasicMaterial color={new THREE.Color(k % 5 === 0 ? colors.indigo : colors.cyan).multiplyScalar(0.55 * fadeEnd)} transparent depthWrite={false} {...ADD} />
        </mesh>
      ))}
      {PANELS.map((x, k) => {
        const lit = k < 3 ? ex(clamp((t - (LIT_AT[k] - HERO_START)) / 0.7)) : 0;
        const rot = (-6 * (k - 1.5) * Math.PI) / 180; // Blender gira alrededor de z; en three, y
        const edge = new THREE.Color(colors.indigo).lerp(new THREE.Color(colors.cyan), lit).multiplyScalar((0.45 + lit * 1.1) * fadeEnd);
        return (
          <group key={k} position={[x, 0.2, 0]} rotation={[0, rot, 0]}>
            <mesh>
              <boxGeometry args={[0.12, 2.9, 3.6]} />
              <meshBasicMaterial color={new THREE.Color(colors.indigo).multiplyScalar(0.06 * fadeEnd)} transparent depthWrite={false} {...ADD} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.12, 2.9, 3.6)]} />
              <lineBasicMaterial color={edge} transparent depthWrite={false} {...ADD} />
            </lineSegments>
            {/* marco grueso que se enciende con cada área */}
            {[[0, 1.45, 3.6, 0.03], [0, -1.45, 3.6, 0.03], [1.8, 0, 0.03, 2.9], [-1.8, 0, 0.03, 2.9]].map(([zz, yy, w, h], i) => (
              <mesh key={i} position={[0, yy, zz]}>
                <boxGeometry args={[0.14, h, w]} />
                <meshBasicMaterial color={edge.clone().multiplyScalar(1.4)} transparent depthWrite={false} {...ADD} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
};
void lerp;

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Extremely subtle ambient particles — tiny, barely visible dots.
 */
export function NeuralParticles({ count = 40, radius = 160 }) {
  const pointsRef = useRef();

  const { origPositions, positions, speeds, offsets } = useMemo(() => {
    const origPositions = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.85 + Math.random() * 0.25);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      origPositions[i * 3] = x;
      origPositions[i * 3 + 1] = y;
      origPositions[i * 3 + 2] = z;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      speeds[i] = 0.05 + Math.random() * 0.15;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    return { origPositions, positions, speeds, offsets };
  }, [count, radius]);

  const bufferGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const arr = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3]     = origPositions[i3]     + Math.sin(t * speeds[i] + offsets[i]) * 1.5;
      arr[i3 + 1] = origPositions[i3 + 1] + Math.cos(t * speeds[i] * 0.7 + offsets[i]) * 1.5;
      arr[i3 + 2] = origPositions[i3 + 2] + Math.sin(t * speeds[i] * 0.5 + offsets[i] + 1) * 1.5;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={bufferGeom}>
      <pointsMaterial
        color="#d4c4b4"
        size={0.3}
        transparent
        opacity={0.12}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

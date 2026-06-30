import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Tiny circular dot texture
function createDotTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.3)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 16, 16);
  return new THREE.CanvasTexture(canvas);
}

/**
 * Very subtle floating dots around the brain.
 */
export function NeuralParticles({ count = 80, radius = 140 }) {
  const pointsRef = useRef();
  const dotTexture = useMemo(() => createDotTexture(), []);

  const { origPositions, speeds, offsets } = useMemo(() => {
    const origPositions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.8 + Math.random() * 0.3);

      origPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      origPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      origPositions[i * 3 + 2] = r * Math.cos(phi);

      speeds[i] = 0.1 + Math.random() * 0.3;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    return { origPositions, speeds, offsets };
  }, [count, radius]);

  const positions = useMemo(() => new Float32Array(origPositions), [origPositions]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const arr = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3]     = origPositions[i3]     + Math.sin(t * speeds[i] + offsets[i]) * 2;
      arr[i3 + 1] = origPositions[i3 + 1] + Math.cos(t * speeds[i] * 0.7 + offsets[i]) * 2;
      arr[i3 + 2] = origPositions[i3 + 2] + Math.sin(t * speeds[i] * 0.5 + offsets[i] + 1) * 2;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#4fc3f7"
        size={0.4}
        map={dotTexture}
        transparent
        opacity={0.15}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

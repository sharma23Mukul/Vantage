import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function MouseParallax({ children }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const { x, y } = state.pointer;
    
    // Use THREE.MathUtils.lerp for smooth, spring-like easing (damping)
    // Formula: lerp(currentValue, targetValue, interpolationFactor)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x,
      delta * 5
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -y,
      delta * 5
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

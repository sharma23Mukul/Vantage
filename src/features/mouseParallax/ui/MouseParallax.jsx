import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function MouseParallax({ children, intensity = 0.5 }) {
  const groupRef = useRef();

  // Simple heuristic: if window width is small, likely mobile/touch where parallax feels clunky
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useFrame((state, delta) => {
    if (!groupRef.current || isMobile) return;
    
    // state.pointer holds normalized mouse coordinates (-1 to +1)
    const { x, y } = state.pointer;
    
    // Scale by intensity so the model doesn't spin wildly
    const targetY = x * intensity;
    const targetX = -y * intensity;
    
    // Use THREE.MathUtils.lerp for smooth, spring-like easing (damping)
    // Formula: lerp(currentValue, targetValue, interpolationFactor)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      delta * 5
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      delta * 5
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

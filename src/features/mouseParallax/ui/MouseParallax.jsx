import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function MouseParallax({ children }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // state.pointer holds normalized mouse coordinates (-1 to +1)
    const { x, y } = state.pointer;
    
    // Direct application (no smoothing yet)
    groupRef.current.rotation.y = x;
    groupRef.current.rotation.x = -y;
  });

  return <group ref={groupRef}>{children}</group>;
}

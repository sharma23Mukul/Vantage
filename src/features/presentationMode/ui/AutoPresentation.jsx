import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';

export function AutoPresentation({ children }) {
  const groupRef = useRef();
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Only auto-rotate if the user is at the very top of the page (scroll.offset === 0)
    // This creates an "idle" presentation mode that stops once they start scrolling.
    if (scroll && scroll.offset < 0.05) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

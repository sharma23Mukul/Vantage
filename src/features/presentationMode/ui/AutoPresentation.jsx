import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

export function AutoPresentation({ children }) {
  const groupRef = useRef();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Only auto-rotate if the user is at the very top of the page (scrollY < 50px)
    // This creates an "idle" presentation mode that stops once they start scrolling.
    if (scrollY < 50) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

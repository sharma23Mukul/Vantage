import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useHotspotsStore } from '../../features/hotspots/model/useHotspotsStore';

/**
 * BrainLobe — A single clickable brain region mesh.
 * Smoothly animates between rest and "popped out" states via useFrame lerp.
 */
export function BrainLobe({ regionData, isActive, isOtherActive }) {
  const meshRef = useRef();
  const setActiveHotspot = useHotspotsStore((s) => s.setActiveHotspot);
  const clearActiveHotspot = useHotspotsStore((s) => s.clearActiveHotspot);

  // Rest position as a Vector3
  const restPos = useMemo(() => new THREE.Vector3(...regionData.position), [regionData]);
  // Active (popped out) position
  const activePos = useMemo(() => {
    const dir = new THREE.Vector3(...regionData.popDirection);
    return restPos.clone().add(dir);
  }, [restPos, regionData]);

  // Material
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: regionData.color,
      metalness: 0.1,
      roughness: 0.12,
      transmission: 0.6,
      thickness: 1.2,
      ior: 1.8,
      clearcoat: 1,
      clearcoatRoughness: 0,
      iridescence: 0.8,
      iridescenceIOR: 1.4,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      envMapIntensity: 1.2,
    });
  }, [regionData.color]);

  // Target values
  const targetScale = isActive ? 1.3 : isOtherActive ? 0.95 : 1;
  const targetOpacity = isActive ? 1 : isOtherActive ? 0.25 : 1;
  const targetEmissive = isActive ? 0.3 : 0;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const t = delta * 4; // lerp speed

    // Lerp position
    const targetPos = isActive ? activePos : restPos;
    mesh.position.lerp(targetPos, t);

    // Lerp scale
    const s = mesh.scale.x;
    const newS = THREE.MathUtils.lerp(s, targetScale, t);
    mesh.scale.setScalar(newS);

    // Lerp opacity
    mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, targetOpacity, t);

    // Lerp emissive
    mesh.material.emissiveIntensity = THREE.MathUtils.lerp(
      mesh.material.emissiveIntensity,
      targetEmissive,
      t
    );
    if (isActive) {
      mesh.material.emissive.set(regionData.color);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (isActive) {
      clearActiveHotspot();
    } else {
      setActiveHotspot({
        id: regionData.id,
        title: regionData.name,
        biology: regionData.biology,
        skillTitle: regionData.skillTitle,
        description: regionData.skillDescription,
      });
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={regionData.position}
      scale={regionData.scale}
      onClick={handleClick}
      material={material}
    >
      <sphereGeometry args={[1, 48, 32]} />
    </mesh>
  );
}

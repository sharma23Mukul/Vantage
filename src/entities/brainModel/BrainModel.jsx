import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BRAIN_REGIONS } from './brainRegionsData';
import { BrainLobe } from './BrainLobe';
import { useHotspotsStore } from '../../features/hotspots/model/useHotspotsStore';

/**
 * BrainModel — The full interactive brain composed of 5 clickable regions.
 * Each region is a BrainLobe that pops out when clicked.
 * The temporal lobe has a mirrored pair (left + right hemisphere).
 */
export function BrainModel() {
  const groupRef = useRef();
  const activeHotspot = useHotspotsStore((s) => s.activeHotspot);
  const clearActiveHotspot = useHotspotsStore((s) => s.clearActiveHotspot);

  // Gentle floating animation
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
  });

  // Click on empty space to deselect
  const handlePointerMissed = () => {
    clearActiveHotspot();
  };

  return (
    <group ref={groupRef} onPointerMissed={handlePointerMissed}>
      {BRAIN_REGIONS.map((region) => {
        const isActive = activeHotspot?.id === region.id;
        const isOtherActive = activeHotspot !== null && !isActive;

        return (
          <group key={region.id}>
            {/* Primary lobe mesh */}
            <BrainLobe
              regionData={region}
              isActive={isActive}
              isOtherActive={isOtherActive}
            />
            {/* Mirror mesh for temporal lobe (right hemisphere) */}
            {region.mirrorPosition && (
              <BrainLobe
                regionData={{
                  ...region,
                  position: region.mirrorPosition,
                  scale: region.mirrorScale || region.scale,
                  popDirection: region.mirrorPopDirection || region.popDirection,
                }}
                isActive={isActive}
                isOtherActive={isOtherActive}
              />
            )}
          </group>
        );
      })}

      {/* Brain stem — small decorative cylinder */}
      <mesh position={[0, -0.85, -0.3]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.4, 16]} />
        <meshPhysicalMaterial
          color="#a0a0b8"
          metalness={0.2}
          roughness={0.3}
          transmission={0.3}
          transparent
          opacity={activeHotspot ? 0.2 : 0.6}
        />
      </mesh>
    </group>
  );
}

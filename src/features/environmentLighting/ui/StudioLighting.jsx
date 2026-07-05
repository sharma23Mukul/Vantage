import { Environment } from '@react-three/drei';

/**
 * Soft, diffuse lighting for realistic brain tissue.
 * Designed to NOT create harsh specular highlights on organic material.
 */
export function StudioLighting() {
  return (
    <>
      {/* Very subtle environment — just enough for ambient color */}
      <Environment preset="studio" environmentIntensity={0.15} />

      {/* Key light — warm, soft, from upper-right */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.8}
        color="#ffe8d8"
      />

      {/* Fill — slightly cooler, from left */}
      <directionalLight
        position={[-4, 3, 2]}
        intensity={0.8}
        color="#f0e0d8"
      />

      {/* Rim — warm, from behind for edge definition */}
      <directionalLight
        position={[0, 2, -4]}
        intensity={0.5}
        color="#ffd8c0"
      />

      {/* Top-down for gyri shadow definition */}
      <directionalLight
        position={[0, 8, 0]}
        intensity={0.4}
        color="#f8e8e0"
      />

      {/* Soft ambient fill */}
      <ambientLight intensity={0.25} color="#e8d0c0" />
    </>
  );
}

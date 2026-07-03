import { Environment } from '@react-three/drei';

/**
 * Medical-grade lighting setup for ultra-realistic brain rendering.
 * Designed to create strong specular catches on the wet clearcoat surface
 * and dramatic shadows in the sulci (brain folds).
 */
export function StudioLighting() {
  return (
    <>
      {/* HDRI for clearcoat reflections — essential for wet look */}
      <Environment preset="studio" environmentIntensity={0.6} />

      {/* Key light — strong warm white, creates the main specular highlights */}
      <directionalLight
        position={[3, 7, 4]}
        intensity={2.2}
        color="#fff4e8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Secondary key — slightly cool, from opposite side for dimension */}
      <directionalLight
        position={[-4, 5, 3]}
        intensity={0.8}
        color="#e0e8f0"
      />

      {/* Back rim — warm, separates brain from the void */}
      <directionalLight
        position={[0, 4, -6]}
        intensity={1.0}
        color="#ffe0c8"
      />

      {/* Top-down — catches the top surfaces of the gyri */}
      <directionalLight
        position={[0, 10, 0]}
        intensity={0.5}
        color="#f8e8d8"
      />

      {/* Low angle warm fill — prevents pitch black undersides */}
      <directionalLight
        position={[2, -4, 3]}
        intensity={0.25}
        color="#e8c8b0"
      />

      {/* Front-bottom fill for the cerebellum */}
      <directionalLight
        position={[-1, -2, 5]}
        intensity={0.15}
        color="#d8c0b0"
      />

      {/* Very dim warm ambient — just enough to prevent pure black */}
      <ambientLight intensity={0.08} color="#c8a898" />
    </>
  );
}

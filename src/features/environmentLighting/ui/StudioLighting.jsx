import { Environment } from '@react-three/drei';

/**
 * Adaptive lighting for realistic brain tissue.
 * Light count and env map presence scale with device tier.
 */
export function StudioLighting({ tierConfig }) {
  const lightCount = tierConfig?.lightCount ?? 4;
  const envMap = tierConfig?.envMap ?? true;

  return (
    <>
      {/* Environment map — only on high tier */}
      {envMap && (
        <Environment preset="studio" environmentIntensity={0.15} />
      )}

      {/* Key light — always present */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.8}
        color="#ffe8d8"
      />

      {/* Fill — medium+ */}
      {lightCount >= 2 && (
        <directionalLight
          position={[-4, 3, 2]}
          intensity={0.8}
          color="#f0e0d8"
        />
      )}

      {/* Rim — high+ (3 or more) */}
      {lightCount >= 3 && (
        <directionalLight
          position={[0, 2, -4]}
          intensity={0.5}
          color="#ffd8c0"
        />
      )}

      {/* Top-down — high only (4) */}
      {lightCount >= 4 && (
        <directionalLight
          position={[0, 8, 0]}
          intensity={0.4}
          color="#f8e8e0"
        />
      )}

      {/* Ambient — always present, slightly boosted when no env map */}
      <ambientLight
        intensity={envMap ? 0.25 : 0.4}
        color="#e8d0c0"
      />
    </>
  );
}

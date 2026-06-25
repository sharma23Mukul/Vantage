import { Environment } from '@react-three/drei';

export function StudioLighting() {
  return (
    <>
      {/* 
        High-fidelity HDRI environment mapping.
        The 'city' preset provides realistic, nuanced reflections 
        that make 3D materials look incredibly premium.
      */}
      <Environment preset="city" environmentIntensity={1.2} />
      
      {/* 
        We can also add a subtle directional light to create some sharp highlights 
        that the HDRI might miss.
      */}
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <ambientLight intensity={0.2} />
    </>
  );
}

import { Environment, ContactShadows } from '@react-three/drei';

export function StudioLighting() {
  return (
    <>
      {/* 
        Studio HDRI for clean, soft reflections suited to a light background.
        The 'studio' preset gives a controlled, product-photography look.
      */}
      <Environment preset="studio" environmentIntensity={0.8} />
      
      {/* Key light — soft and directional from upper-right */}
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
      
      {/* Fill light — subtle from the left to soften shadows */}
      <directionalLight position={[-3, 4, 2]} intensity={0.4} color="#e8e4f0" />
      
      {/* Rim light — from behind to create a glowing edge effect */}
      <directionalLight position={[0, 3, -5]} intensity={0.8} color="#d4c5f9" />
      
      {/* Ambient fill */}
      <ambientLight intensity={0.5} />
      
      {/* Contact shadow to ground the model */}
      <ContactShadows 
        position={[0, -1.5, 0]} 
        opacity={0.25} 
        scale={8} 
        blur={2.5} 
        far={4} 
        color="#2d3748"
      />
    </>
  );
}

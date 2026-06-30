export function StudioLighting() {
  return (
    <>
      {/* No Environment preset — we want pure dark with controlled lights */}
      
      {/* Key light — cool cyan from upper-right */}
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#4fc3f7" />
      
      {/* Fill light — warm orange from the left */}
      <directionalLight position={[-4, 3, 2]} intensity={0.5} color="#ff9800" />
      
      {/* Rim light — strong cyan from behind for edge glow */}
      <directionalLight position={[0, 2, -6]} intensity={0.8} color="#4fc3f7" />
      
      {/* Bottom fill — subtle purple uplighting */}
      <directionalLight position={[0, -4, 0]} intensity={0.2} color="#7c4dff" />
      
      {/* Very dim ambient to prevent total blackness */}
      <ambientLight intensity={0.08} color="#1a237e" />
    </>
  );
}

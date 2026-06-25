import { ModelViewer } from '../../../features/modelLoader';
import { ScrollCamera } from '../../../features/scrollCamera';
import { HotspotMarker, HotspotDetails } from '../../../features/hotspots';
import { VariantApplicator, VariantSelector } from '../../../features/variantSwitcher';
import { VideoApplicator, VideoToggle } from '../../../features/videoTexture';
import { StudioLighting } from '../../../features/environmentLighting';

export function ProductViewer() {
  const hotspotsData = [
    {
      id: 'beak',
      position: [0, 0.5, 1], // Approximation for Duck.glb
      title: 'Aerodynamic Beak',
      description: 'Engineered for maximum velocity when moving through water.'
    },
    {
      id: 'tail',
      position: [0, 0.2, -1], // Approximation for Duck.glb
      title: 'Stabilizing Tail',
      description: 'Provides pitch perfect balance during turbulent splash scenarios.'
    }
  ];

  return (
    <>
      <section className="fixed top-0 left-0 w-full h-screen -z-10 pointer-events-auto">
        <ModelViewer url="/models/Duck.glb" enableControls={false}>
          <StudioLighting />
          <ScrollCamera />
          <VariantApplicator url="/models/Duck.glb" />
          <VideoApplicator url="/models/Duck.glb" videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" />
          {hotspotsData.map((data) => (
            <HotspotMarker key={data.id} position={data.position} data={data} />
          ))}
        </ModelViewer>
      </section>
      
      {/* 2D Overlay layer for UI components */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-40">
        <div className="relative w-full h-full pointer-events-none">
          <HotspotDetails />
          <VariantSelector />
          <VideoToggle />
        </div>
      </div>
    </>
  );
}

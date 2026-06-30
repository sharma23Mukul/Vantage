import { ModelViewer } from '../../../features/modelLoader';
import { ScrollCamera } from '../../../features/scrollCamera';
import { HotspotDetails } from '../../../features/hotspots';
import { StudioLighting } from '../../../features/environmentLighting';
import { CinematicEffects } from '../../../features/postProcessing';
import { MouseParallax } from '../../../features/mouseParallax';

export function ProductViewer() {
  return (
    <>
      <section className="fixed top-0 left-0 w-full h-screen z-10 pointer-events-auto">
        <ModelViewer enableControls={true}>
          <StudioLighting />
          <CinematicEffects />
          <ScrollCamera />
        </ModelViewer>
      </section>
      
      {/* 2D Overlay layer for UI components */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-40">
        <div className="relative w-full h-full pointer-events-none">
          <HotspotDetails />
        </div>
      </div>
    </>
  );
}

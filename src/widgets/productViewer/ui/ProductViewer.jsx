import { ModelViewer } from '../../../features/modelLoader';
import { ScrollCamera } from '../../../features/scrollCamera';
import { HotspotDetails } from '../../../features/hotspots';
import { StudioLighting } from '../../../features/environmentLighting';
import { CinematicEffects } from '../../../features/postProcessing';
import { useDeviceTier } from '../../../shared/lib/useDeviceTier';

export function ProductViewer() {
  const { config, degradeTier, upgradeTier } = useDeviceTier();

  return (
    <>
      <section className="fixed top-0 left-0 w-full h-screen z-10 pointer-events-auto">
        <ModelViewer
          enableControls={true}
          tierConfig={config}
          onPerformanceDecline={degradeTier}
          onPerformanceIncline={upgradeTier}
        >
          <StudioLighting tierConfig={config} />
          {config.bloom && <CinematicEffects />}
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

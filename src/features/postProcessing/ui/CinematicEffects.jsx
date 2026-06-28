import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function CinematicEffects() {
  return (
    <EffectComposer disableNormalPass>
      {/* 
        Bloom — subtle for light theme, just catches shiny material highlights 
      */}
      <Bloom 
        intensity={0.3} 
        luminanceThreshold={0.9} 
        luminanceSmoothing={0.05} 
        blendFunction={BlendFunction.SCREEN} 
      />
      
      {/* 
        Vignette — very subtle on light backgrounds to softly frame the scene 
      */}
      <Vignette 
        eskil={false} 
        offset={0.15} 
        darkness={0.3} 
        blendFunction={BlendFunction.NORMAL} 
      />
    </EffectComposer>
  );
}

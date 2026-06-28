import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function CinematicEffects() {
  return (
    <EffectComposer disableNormalPass>
      {/* 
        Bloom creates a glowing effect around bright objects. 
        It makes highlights from the HDRI lighting pop beautifully.
      */}
      <Bloom 
        intensity={0.5} 
        luminanceThreshold={0.8} 
        luminanceSmoothing={0.1} 
        blendFunction={BlendFunction.SCREEN} 
      />
      
      {/* 
        Vignette subtly darkens the edges of the screen, 
        drawing the user's eye toward the center 3D model.
      */}
      <Vignette 
        eskil={false} 
        offset={0.1} 
        darkness={0.6} 
        blendFunction={BlendFunction.NORMAL} 
      />
    </EffectComposer>
  );
}

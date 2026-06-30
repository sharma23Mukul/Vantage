import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function CinematicEffects() {
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      {/* 
        Bloom — very subtle, just a soft glow on bright edges.
        Low mipmapBlur resolution to prevent blocky artifacts.
      */}
      <Bloom 
        intensity={0.4} 
        luminanceThreshold={0.6} 
        luminanceSmoothing={0.9} 
        mipmapBlur
        radius={0.8}
        blendFunction={BlendFunction.ADD} 
      />
      
      {/* 
        Vignette — subtle darkening around edges to frame the brain 
      */}
      <Vignette 
        eskil={false} 
        offset={0.2} 
        darkness={0.5} 
        blendFunction={BlendFunction.NORMAL} 
      />
    </EffectComposer>
  );
}

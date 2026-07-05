import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function CinematicEffects() {
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      {/* Very subtle bloom for specular catches */}
      <Bloom
        intensity={0.1}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.6}
        blendFunction={BlendFunction.ADD}
      />

      {/* Cinematic vignette */}
      <Vignette
        eskil={false}
        offset={0.25}
        darkness={0.55}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

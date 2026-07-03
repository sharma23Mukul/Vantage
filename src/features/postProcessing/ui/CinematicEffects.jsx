import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/**
 * Cinematic post-processing for medical visualization feel.
 */
export function CinematicEffects() {
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      {/* Soft bloom catches the specular highlights on the wet surface */}
      <Bloom
        intensity={0.15}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.7}
        blendFunction={BlendFunction.ADD}
      />

      {/* Subtle chromatic aberration for a microscope/camera lens feel */}
      <ChromaticAberration
        offset={[0.0004, 0.0004]}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Deep vignette for dramatic framing */}
      <Vignette
        eskil={false}
        offset={0.3}
        darkness={0.65}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

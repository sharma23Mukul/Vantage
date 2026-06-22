import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useVariantStore } from '../model/useVariantStore';

export function VariantApplicator({ url }) {
  // Retrieve the same cached scene used by ModelViewer
  const { scene } = useGLTF(url);
  const activeColor = useVariantStore((state) => state.activeColor);

  useEffect(() => {
    if (!scene) return;

    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        // Skip eyes/beak based on common naming or just color everything
        if (node.name.toLowerCase().includes('eye')) return;
        if (node.name.toLowerCase().includes('blinn3')) return; // For Duck.glb, beak is often a separate material

        if (node.material.color) {
          // In a production app, we could use GSAP or react-spring to tween the color
          node.material.color.set(activeColor);
          node.material.needsUpdate = true;
        }
      }
    });
  }, [scene, activeColor]);

  return null;
}

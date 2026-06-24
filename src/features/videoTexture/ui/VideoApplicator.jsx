import { useEffect, useState } from 'react';
import { useGLTF, useVideoTexture } from '@react-three/drei';
import { useVideoStore } from '../model/useVideoStore';
import * as THREE from 'three';

export function VideoApplicator({ url, videoUrl }) {
  const { scene } = useGLTF(url);
  const isVideoActive = useVideoStore((state) => state.isVideoActive);
  
  // This automatically fetches and plays the video texture. 
  // If it's the first time, it will suspend and show the fallback Loader!
  const texture = useVideoTexture(videoUrl, { crossOrigin: 'Anonymous' });
  
  const [originalMaps, setOriginalMaps] = useState(new Map());

  useEffect(() => {
    if (!scene || !texture) return;

    // eslint-disable-next-line
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        if (node.name.toLowerCase().includes('eye') || node.name.toLowerCase().includes('blinn3')) return;

        // Save original map
        if (!originalMaps.has(node.uuid)) {
          setOriginalMaps((prev) => {
            const newMap = new Map(prev);
            newMap.set(node.uuid, node.material.map);
            return newMap;
          });
        }

        if (isVideoActive) {
          node.material.map = texture;
          node.material.needsUpdate = true;
        } else {
          // Restore original map
          const origMap = originalMaps.get(node.uuid) || null;
          node.material.map = origMap;
          node.material.needsUpdate = true;
        }
      }
    });
  }, [scene, isVideoActive, texture, originalMaps]);

  return null;
}

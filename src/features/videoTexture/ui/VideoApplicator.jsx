import { useEffect, useRef } from 'react';
import { useGLTF, useVideoTexture } from '@react-three/drei';
import { useVideoStore } from '../model/useVideoStore';
import * as THREE from 'three';

export function VideoApplicator({ url, videoUrl }) {
  const { scene } = useGLTF(url);
  const isVideoActive = useVideoStore((state) => state.isVideoActive);
  
  const texture = useVideoTexture(videoUrl, { crossOrigin: 'Anonymous' });
  
  // Use a ref instead of state to avoid infinite re-render loops
  const originalMapsRef = useRef(new Map());

  useEffect(() => {
    if (!scene || !texture) return;

    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        if (node.name.toLowerCase().includes('eye') || node.name.toLowerCase().includes('blinn3')) return;

        // Save original map (only once)
        if (!originalMapsRef.current.has(node.uuid)) {
          originalMapsRef.current.set(node.uuid, node.material.map);
        }

        if (isVideoActive) {
          node.material.map = texture;
          node.material.needsUpdate = true;
        } else {
          const origMap = originalMapsRef.current.get(node.uuid) || null;
          node.material.map = origMap;
          node.material.needsUpdate = true;
        }
      }
    });
  }, [scene, isVideoActive, texture]);

  return null;
}

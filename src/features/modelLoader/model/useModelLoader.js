import { useGLTF } from '@react-three/drei';

export function useModelLoader(url) {
  // useGLTF handles loading, caching, and suspension automatically
  const gltf = useGLTF(url);
  return gltf;
}

// Provide a way to preload models
export function preloadModel(url) {
  useGLTF.preload(url);
}

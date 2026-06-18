import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { useModelLoader } from '../model/useModelLoader';
import { Loader } from './Loader';

// The actual 3D model component that suspends
function Model({ url }) {
  const { scene } = useModelLoader(url);
  const ref = useRef();

  // Gentle idle animation
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
    }
  });

  return <primitive ref={ref} object={scene} />;
}

export function ModelViewer({ url = '/models/Duck.glb' }) {
  return (
    <div className="w-full h-full relative bg-void overflow-hidden">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={<Loader />}>
          <Stage environment="city" intensity={0.5}>
            <Model url={url} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enableZoom={false} />
      </Canvas>
    </div>
  );
}

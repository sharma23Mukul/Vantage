import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Loader } from './Loader';
import { BrainModel } from '../../../entities/brainModel';

export function ModelViewer({ children, enableControls = true }) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Force dark scene background */}
        <color attach="background" args={['#0a0a12']} />
        <fog attach="fog" args={['#0a0a12', 8, 18]} />

        <Suspense fallback={<Loader />}>
          <BrainModel />
          {enableControls && (
            <OrbitControls
              makeDefault
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
              dampingFactor={0.05}
              enableDamping
            />
          )}
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}

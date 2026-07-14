import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { Loader } from './Loader';
import { BrainModel } from '../../../entities/brainModel';

export function ModelViewer({
  children,
  enableControls = true,
  tierConfig,
  onPerformanceDecline,
  onPerformanceIncline,
}) {
  const dpr = tierConfig?.dpr || [1, 2];
  const antialias = tierConfig?.antialias ?? true;

  return (
    <div className="w-full h-full relative overflow-hidden">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
      >
        <PerformanceMonitor
          onDecline={onPerformanceDecline}
          onIncline={onPerformanceIncline}
          flipflops={3}
          onFallback={() => onPerformanceDecline?.()}
        >
          <Suspense fallback={<Loader />}>
            <BrainModel tierConfig={tierConfig} />
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
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}

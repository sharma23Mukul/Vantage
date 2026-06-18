import { Html, useProgress } from '@react-three/drei';

export function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-text-primary whitespace-nowrap bg-surface/80 p-sp-4 rounded-xl backdrop-blur-sm border border-border">
        <span className="text-3xl font-bold">{progress.toFixed(0)}%</span>
        <span className="text-sm text-text-secondary mt-sp-2">Loading 3D Experience</span>
      </div>
    </Html>
  );
}

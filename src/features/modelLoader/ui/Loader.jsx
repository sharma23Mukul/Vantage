import { Html, useProgress } from '@react-three/drei';

export function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-text-primary whitespace-nowrap bg-white/50 p-sp-3 md:p-sp-4 rounded-xl backdrop-blur-md border border-white/20 shadow-md">
        <span className="font-oswald font-bold text-2xl md:text-3xl uppercase">{progress.toFixed(0)}%</span>
        <span className="subheading-editorial mt-sp-1 md:mt-sp-2 text-xs md:text-sm text-text-secondary">Loading</span>
      </div>
    </Html>
  );
}

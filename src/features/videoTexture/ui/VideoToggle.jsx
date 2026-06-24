import { useVideoStore } from '../model/useVideoStore';
import { Play, Pause } from 'lucide-react';

export function VideoToggle() {
  const isVideoActive = useVideoStore((state) => state.isVideoActive);
  const toggleVideo = useVideoStore((state) => state.toggleVideo);

  return (
    <div className="absolute top-sp-8 right-sp-8 z-50 pointer-events-auto">
      <button
        onClick={toggleVideo}
        className={`flex items-center gap-sp-2 px-sp-4 py-sp-2 rounded-full font-bold font-syne transition-all duration-300 shadow-xl border ${
          isVideoActive 
            ? 'bg-accent text-void border-accent' 
            : 'bg-surface/80 backdrop-blur-md text-text-primary border-border hover:bg-surface'
        }`}
        aria-label="Toggle Video Texture"
      >
        {isVideoActive ? (
          <>
            <Pause size={18} fill="currentColor" />
            <span>Pause Video Map</span>
          </>
        ) : (
          <>
            <Play size={18} fill="currentColor" />
            <span>Play Video Map</span>
          </>
        )}
      </button>
    </div>
  );
}

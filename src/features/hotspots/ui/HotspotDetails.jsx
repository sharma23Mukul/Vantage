import { useHotspotsStore } from '../model/useHotspotsStore';
import { X } from 'lucide-react';

export function HotspotDetails() {
  const activeHotspot = useHotspotsStore((state) => state.activeHotspot);
  const clearActiveHotspot = useHotspotsStore((state) => state.clearActiveHotspot);

  if (!activeHotspot) return null;

  return (
    <div className="absolute bottom-[90px] md:bottom-sp-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-sp-8 z-50 w-[90vw] md:w-[300px] bg-white/50 backdrop-blur-md border border-white/20 p-sp-4 md:p-sp-6 rounded-2xl shadow-md pointer-events-auto">
      <div className="flex justify-between items-start mb-sp-4">
        <h3 className="font-oswald font-bold text-xl uppercase text-text-primary">{activeHotspot.title}</h3>
        <button 
          onClick={clearActiveHotspot}
          className="text-text-secondary hover:text-text-primary transition-colors bg-white/40 rounded-full p-1"
          aria-label="Close details"
        >
          <X size={18} />
        </button>
      </div>
      <p className="text-text-secondary leading-relaxed">
        {activeHotspot.description}
      </p>
    </div>
  );
}

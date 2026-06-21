import { useHotspotsStore } from '../model/useHotspotsStore';
import { X } from 'lucide-react';

export function HotspotDetails() {
  const activeHotspot = useHotspotsStore((state) => state.activeHotspot);
  const clearActiveHotspot = useHotspotsStore((state) => state.clearActiveHotspot);

  if (!activeHotspot) return null;

  return (
    <div className="absolute bottom-sp-8 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-sp-8 z-50 w-[300px] bg-surface/90 backdrop-blur-md border border-border p-sp-6 rounded-2xl shadow-2xl">
      <div className="flex justify-between items-start mb-sp-4">
        <h3 className="text-xl font-bold font-syne text-text-primary">{activeHotspot.title}</h3>
        <button 
          onClick={clearActiveHotspot}
          className="text-text-secondary hover:text-text-primary transition-colors bg-surface-raised rounded-full p-1"
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

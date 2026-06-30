import { useHotspotsStore } from '../model/useHotspotsStore';
import { X } from 'lucide-react';

export function HotspotDetails() {
  const activeHotspot = useHotspotsStore((state) => state.activeHotspot);
  const clearActiveHotspot = useHotspotsStore((state) => state.clearActiveHotspot);

  if (!activeHotspot) return null;

  return (
    <div className="absolute bottom-sp-4 md:bottom-sp-8 right-sp-4 md:right-sp-8 z-50 w-[90vw] md:w-[340px] bg-white/50 backdrop-blur-xl border border-white/30 p-sp-5 md:p-sp-6 rounded-2xl shadow-lg pointer-events-auto transition-all duration-500">
      {/* Region name */}
      <div className="flex justify-between items-start mb-sp-3">
        <h3 className="font-oswald font-bold text-xl md:text-2xl uppercase text-text-primary leading-tight">
          {activeHotspot.title}
        </h3>
        <button 
          onClick={clearActiveHotspot}
          className="text-text-secondary hover:text-text-primary transition-colors bg-white/40 rounded-full p-1 ml-3 flex-shrink-0"
          aria-label="Close details"
        >
          <X size={18} />
        </button>
      </div>

      {/* Biology tagline */}
      <p className="text-xs text-accent font-medium uppercase tracking-wider mb-sp-3">
        {activeHotspot.biology}
      </p>

      {/* Divider */}
      <div className="w-full h-px bg-border/50 mb-sp-3" />

      {/* Skill mapping */}
      <p className="font-oswald font-bold text-base uppercase text-accent-warm mb-sp-2">
        {activeHotspot.skillTitle}
      </p>
      <p className="text-sm text-text-secondary leading-relaxed">
        {activeHotspot.description}
      </p>
    </div>
  );
}

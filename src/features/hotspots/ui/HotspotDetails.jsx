import { useHotspotsStore } from '../model/useHotspotsStore';
import { X } from 'lucide-react';

export function HotspotDetails() {
  const activeHotspot = useHotspotsStore((state) => state.activeHotspot);
  const clearActiveHotspot = useHotspotsStore((state) => state.clearActiveHotspot);

  if (!activeHotspot) return null;

  return (
    <div 
      className="absolute bottom-sp-4 md:bottom-sp-8 right-sp-4 md:right-sp-8 z-50 w-[90vw] md:w-[340px] bg-void/70 backdrop-blur-md border border-accent/20 p-sp-5 md:p-sp-6 rounded-2xl shadow-glow pointer-events-auto"
      style={{ animation: 'slideUpFade 0.5s var(--ease-out-expo) forwards' }}
    >
      {/* Region name */}
      <div className="flex justify-between items-start mb-sp-3">
        <h3 className="font-oswald font-bold text-xl md:text-2xl uppercase text-text-primary leading-tight">
          {activeHotspot.title}
        </h3>
        <button 
          onClick={clearActiveHotspot}
          className="text-text-secondary hover:text-accent transition-colors bg-surface hover:bg-surface-raised rounded-full p-1 ml-3 flex-shrink-0"
          aria-label="Close details"
        >
          <X size={18} />
        </button>
      </div>

      {/* Biology tagline (Category Label - Cool Cyan) */}
      <p className="font-oswald font-semibold text-xs text-accent-secondary uppercase tracking-[0.05em] mb-sp-3">
        {activeHotspot.biology}
      </p>

      {/* Divider */}
      <div className="w-full h-px bg-border mb-sp-3" />

      {/* Skill mapping (Section Label - Warm Copper) */}
      <p className="font-oswald font-semibold text-xs text-accent uppercase tracking-[0.05em] mb-sp-2">
        {activeHotspot.skillTitle}
      </p>
      <p className="text-sm text-text-secondary leading-relaxed">
        {activeHotspot.description}
      </p>
    </div>
  );
}

import { useHotspotsStore } from '../model/useHotspotsStore';
import { X } from 'lucide-react';

export function HotspotDetails() {
  const activeHotspot = useHotspotsStore((state) => state.activeHotspot);
  const clearActiveHotspot = useHotspotsStore((state) => state.clearActiveHotspot);

  if (!activeHotspot) return null;

  return (
    <div 
      className="absolute bottom-sp-4 md:bottom-sp-8 right-sp-4 md:right-sp-8 z-50 w-[90vw] md:w-[340px] bg-ink border-[3px] border-ink p-sp-5 md:p-sp-6 rounded-sm shadow-terracotta pointer-events-auto"
      style={{ animation: 'slideUpFade 0.5s var(--ease-out-expo) forwards' }}
    >
      {/* Region name */}
      <div className="flex justify-between items-start mb-sp-3">
        <h3 className="font-oswald font-black text-xl md:text-2xl uppercase text-bg-panel leading-tight">
          {activeHotspot.title}
        </h3>
        <button 
          onClick={clearActiveHotspot}
          className="text-bg-panel hover:text-terracotta transition-colors bg-white/10 hover:bg-white/20 rounded-sm p-1 ml-3 flex-shrink-0"
          aria-label="Close details"
        >
          <X size={18} />
        </button>
      </div>

      {/* Biology tagline (Category Label - Sand) */}
      <p className="font-oswald font-bold text-xs text-sand uppercase tracking-widest mb-sp-3">
        {activeHotspot.biology}
      </p>

      {/* Divider */}
      <div className="w-full h-[2px] bg-ink-soft/40 mb-sp-3" />

      {/* Skill mapping (Section Label - Light Terracotta) */}
      <p className="font-oswald font-bold text-xs text-[#E8789A] uppercase tracking-widest mb-sp-2">
        {activeHotspot.skillTitle}
      </p>
      <p className="text-sm text-bg-panel opacity-90 font-medium leading-relaxed">
        {activeHotspot.description}
      </p>
    </div>
  );
}

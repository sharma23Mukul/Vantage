import { useVariantStore } from '../model/useVariantStore';

// Hardcoded fallback — used when API hasn't loaded yet
const FALLBACK_VARIANTS = [
  { id: 'classic', base_color: '#ffcc00', name: 'Classic Yellow' },
  { id: 'crimson', base_color: '#e63946', name: 'Crimson Red' },
];

export function VariantSelector() {
  const activeColor = useVariantStore((state) => state.activeColor);
  const setActiveColor = useVariantStore((state) => state.setActiveColor);
  const materials = useVariantStore((state) => state.materials);

  // Use API materials if loaded, otherwise fallback
  const variants = materials.length > 0
    ? materials.map((m) => ({ id: m.id, base_color: m.base_color, name: m.name }))
    : FALLBACK_VARIANTS;

  return (
    <div className="absolute bottom-sp-4 md:bottom-sp-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-sp-2 md:gap-sp-4 bg-bg-panel p-sp-2 md:p-sp-3 border-[2px] border-ink rounded-sm shadow-sm pointer-events-auto">
      {variants.map((variant) => {
        const isActive = activeColor === variant.base_color;
        return (
          <button
            key={variant.id}
            onClick={() => setActiveColor(variant.base_color)}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-sm transition-all duration-300 border-2 ${
              isActive ? 'scale-110 border-ink shadow-sm' : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'
            }`}
            style={{ backgroundColor: variant.base_color }}
            aria-label={`Select ${variant.name} color`}
            title={variant.name}
          />
        );
      })}
    </div>
  );
}

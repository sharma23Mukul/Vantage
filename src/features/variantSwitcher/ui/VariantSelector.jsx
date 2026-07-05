import { useVariantStore } from '../model/useVariantStore';

const VARIANTS = [
  { id: 'classic', color: '#ffcc00', label: 'Classic Yellow' },
  { id: 'crimson', color: '#e63946', label: 'Crimson Red' },
];

export function VariantSelector() {
  const activeColor = useVariantStore((state) => state.activeColor);
  const setActiveColor = useVariantStore((state) => state.setActiveColor);

  return (
    <div className="absolute bottom-sp-4 md:bottom-sp-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-sp-2 md:gap-sp-4 bg-bg-panel p-sp-2 md:p-sp-3 border-[2px] border-ink rounded-sm shadow-sm pointer-events-auto">
      {VARIANTS.map((variant) => {
        const isActive = activeColor === variant.color;
        return (
          <button
            key={variant.id}
            onClick={() => setActiveColor(variant.color)}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-sm transition-all duration-300 border-2 ${
              isActive ? 'scale-110 border-ink shadow-sm' : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'
            }`}
            style={{ backgroundColor: variant.color }}
            aria-label={`Select ${variant.label} color`}
            title={variant.label}
          />
        );
      })}
    </div>
  );
}

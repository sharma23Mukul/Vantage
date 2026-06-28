import { useVariantStore } from '../model/useVariantStore';

const VARIANTS = [
  { id: 'classic', color: '#ffcc00', label: 'Classic Yellow' },
  { id: 'crimson', color: '#e63946', label: 'Crimson Red' },
  { id: 'teal', color: '#457b9d', label: 'Ocean Teal' },
  { id: 'stealth', color: '#1d3557', label: 'Stealth Blue' },
];

export function VariantSelector() {
  const activeColor = useVariantStore((state) => state.activeColor);
  const setActiveColor = useVariantStore((state) => state.setActiveColor);

  return (
    <div className="absolute bottom-sp-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-sp-4 bg-white/40 backdrop-blur-md p-sp-3 rounded-full border border-white/20 shadow-md pointer-events-auto">
      {VARIANTS.map((variant) => {
        const isActive = activeColor === variant.color;
        return (
          <button
            key={variant.id}
            onClick={() => setActiveColor(variant.color)}
            className={`w-10 h-10 rounded-full transition-all duration-300 border-2 ${
              isActive ? 'scale-110 border-text-primary shadow-[0_0_12px_rgba(0,0,0,0.15)]' : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'
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

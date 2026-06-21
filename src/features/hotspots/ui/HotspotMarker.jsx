import { Html } from '@react-three/drei';
import { useHotspotsStore } from '../model/useHotspotsStore';

export function HotspotMarker({ position, data }) {
  const setActiveHotspot = useHotspotsStore((state) => state.setActiveHotspot);
  const activeHotspot = useHotspotsStore((state) => state.activeHotspot);
  const isActive = activeHotspot?.id === data.id;

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent clicking through to the canvas
    setActiveHotspot(data);
  };

  return (
    <Html position={position} center zIndexRange={[100, 0]}>
      <button 
        onClick={handleClick}
        className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center border-2 border-void ${isActive ? 'bg-accent scale-125' : 'bg-surface hover:scale-110'}`}
        aria-label={`View details for ${data.title}`}
        style={{
          boxShadow: isActive ? '0 0 15px var(--color-accent)' : '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-void' : 'bg-accent'}`} />
      </button>
    </Html>
  );
}

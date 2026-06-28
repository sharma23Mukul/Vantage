import { Html } from '@react-three/drei';
import { useHotspotsStore } from '../model/useHotspotsStore';

export function HotspotMarker({ position, data }) {
  const setActiveHotspot = useHotspotsStore((state) => state.setActiveHotspot);
  const activeHotspot = useHotspotsStore((state) => state.activeHotspot);
  const isActive = activeHotspot?.id === data.id;

  return (
    <Html position={position} center>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveHotspot(data);
        }}
        className="group relative flex items-center justify-center cursor-pointer"
        aria-label={`View details for ${data.title}`}
      >
        {/* Outer pulse ring */}
        <span className={`absolute w-8 h-8 rounded-full ${isActive ? 'bg-accent/20' : 'bg-text-primary/10'} animate-ping`} />
        {/* Inner dot */}
        <div className={`w-3 h-3 rounded-full border-2 border-white shadow-md ${isActive ? 'bg-accent' : 'bg-text-primary'}`} />
      </button>
    </Html>
  );
}

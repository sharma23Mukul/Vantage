import { create } from 'zustand';

export const useHotspotsStore = create((set) => ({
  activeHotspot: null,
  setActiveHotspot: (hotspot) => set({ activeHotspot: hotspot }),
  clearActiveHotspot: () => set({ activeHotspot: null }),
}));

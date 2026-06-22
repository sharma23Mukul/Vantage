import { create } from 'zustand';

export const useVariantStore = create((set) => ({
  activeColor: '#ffcc00', // Default yellow for Duck
  setActiveColor: (colorHex) => set({ activeColor: colorHex }),
}));

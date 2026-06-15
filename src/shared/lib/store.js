import { create } from 'zustand';

// Combined store containing UI and Product slices for simplicity and unified state tracking
const useStore = create((set) => ({
  // UI Slice
  isLoading: true,
  loaderProgress: 0,
  activeHotspot: null,
  setLoading: (val) => set({ isLoading: val }),
  setProgress: (val) => set({ loaderProgress: val }),
  setActiveHotspot: (val) => set({ activeHotspot: val }),

  // Product Slice
  activeVariant: 'default',
  variants: [],
  setVariant: (val) => set({ activeVariant: val }),
  setVariants: (val) => set({ variants: val }),
}));

export function useUIStore(selector) {
  return useStore((state) => {
    const slice = {
      isLoading: state.isLoading,
      loaderProgress: state.loaderProgress,
      activeHotspot: state.activeHotspot,
      setLoading: state.setLoading,
      setProgress: state.setProgress,
      setActiveHotspot: state.setActiveHotspot,
    };
    return selector ? selector(slice) : slice;
  });
}

export function useProductStore(selector) {
  return useStore((state) => {
    const slice = {
      activeVariant: state.activeVariant,
      variants: state.variants,
      setVariant: state.setVariant,
      setVariants: state.setVariants,
    };
    return selector ? selector(slice) : slice;
  });
}

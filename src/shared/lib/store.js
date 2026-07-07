import { create } from 'zustand';
import { fetchProducts, fetchProductScene } from '../api/products';

// Combined store containing UI and Product slices for simplicity and unified state tracking
const useStore = create((set, get) => ({
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

  // API-driven state
  products: [],
  activeProduct: null,
  activeScene: null,
  apiLoading: false,
  apiError: null,

  /**
   * Fetch products from the API and set the first one as active.
   */
  fetchProducts: async () => {
    set({ apiLoading: true, apiError: null });
    try {
      const data = await fetchProducts(1, 10);
      const products = data.items || [];
      set({ products, apiLoading: false });

      // Auto-select the first product and load its scene
      if (products.length > 0 && !get().activeProduct) {
        get().fetchScene(products[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      set({ apiError: err.message, apiLoading: false });
    }
  },

  /**
   * Fetch the full scene config for a product.
   */
  fetchScene: async (productId) => {
    set({ apiLoading: true, apiError: null });
    try {
      const scene = await fetchProductScene(productId);
      set({
        activeProduct: productId,
        activeScene: scene,
        apiLoading: false,
      });
    } catch (err) {
      console.error('Failed to fetch scene:', err);
      set({ apiError: err.message, apiLoading: false });
    }
  },

  clearApiError: () => set({ apiError: null }),
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
      // New API-driven state
      products: state.products,
      activeProduct: state.activeProduct,
      activeScene: state.activeScene,
      apiLoading: state.apiLoading,
      apiError: state.apiError,
      fetchProducts: state.fetchProducts,
      fetchScene: state.fetchScene,
      clearApiError: state.clearApiError,
    };
    return selector ? selector(slice) : slice;
  });
}

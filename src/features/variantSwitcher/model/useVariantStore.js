import { create } from 'zustand';
import { fetchMaterials } from '../../../shared/api/products';

export const useVariantStore = create((set) => ({
  activeColor: '#ffcc00', // Default yellow for Duck
  setActiveColor: (colorHex) => set({ activeColor: colorHex }),

  // API-driven material variants
  materials: [],
  materialsLoading: false,
  materialsError: null,

  /**
   * Fetch material variants from the API for a given scene.
   */
  fetchMaterials: async (sceneId) => {
    set({ materialsLoading: true, materialsError: null });
    try {
      const materials = await fetchMaterials(sceneId);
      set({ materials, materialsLoading: false });

      // Auto-select the first material's color if available
      if (materials.length > 0) {
        set({ activeColor: materials[0].base_color });
      }
    } catch (err) {
      console.error('Failed to fetch materials:', err);
      set({ materialsError: err.message, materialsLoading: false });
    }
  },
}));

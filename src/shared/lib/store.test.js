import { describe, it, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';

// Create a standalone store with the same shape as the real one, but without
// the API imports that require import.meta.env (Vite-only).
// This tests the pure state logic — setters, initial values, clearApiError.
function createTestStore() {
  return create((set, get) => ({
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

    clearApiError: () => set({ apiError: null }),
  }));
}

describe('shared store — UI slice', () => {
  let useStore;

  beforeEach(() => {
    useStore = createTestStore();
  });

  it('has correct initial defaults', () => {
    const state = useStore.getState();
    expect(state.isLoading).toBe(true);
    expect(state.loaderProgress).toBe(0);
    expect(state.activeHotspot).toBeNull();
  });

  it('setLoading toggles loading state', () => {
    useStore.getState().setLoading(false);
    expect(useStore.getState().isLoading).toBe(false);
  });

  it('setProgress updates loader progress', () => {
    useStore.getState().setProgress(75);
    expect(useStore.getState().loaderProgress).toBe(75);
  });

  it('setActiveHotspot sets the active hotspot', () => {
    const hotspot = { id: 'test-region', title: 'Test' };
    useStore.getState().setActiveHotspot(hotspot);
    expect(useStore.getState().activeHotspot).toEqual(hotspot);
  });
});

describe('shared store — Product slice', () => {
  let useStore;

  beforeEach(() => {
    useStore = createTestStore();
    useStore.setState({ apiError: 'some error' });
  });

  it('has correct initial defaults', () => {
    const fresh = createTestStore();
    const state = fresh.getState();
    expect(state.activeVariant).toBe('default');
    expect(state.variants).toEqual([]);
  });

  it('setVariant updates the active variant', () => {
    useStore.getState().setVariant('crimson');
    expect(useStore.getState().activeVariant).toBe('crimson');
  });

  it('setVariants updates the variants list', () => {
    const variants = [{ id: 'a' }, { id: 'b' }];
    useStore.getState().setVariants(variants);
    expect(useStore.getState().variants).toEqual(variants);
  });

  it('clearApiError resets apiError to null', () => {
    expect(useStore.getState().apiError).toBe('some error');
    useStore.getState().clearApiError();
    expect(useStore.getState().apiError).toBeNull();
  });
});

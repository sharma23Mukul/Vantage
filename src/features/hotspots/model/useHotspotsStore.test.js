import { describe, it, expect, beforeEach } from 'vitest';
import { useHotspotsStore } from './useHotspotsStore';

describe('useHotspotsStore', () => {
  beforeEach(() => {
    // Reset store to initial state between tests
    useHotspotsStore.setState({ activeHotspot: null });
  });

  it('has null activeHotspot by default', () => {
    const state = useHotspotsStore.getState();
    expect(state.activeHotspot).toBeNull();
  });

  it('setActiveHotspot updates the active hotspot', () => {
    const hotspot = {
      id: 'prefrontal',
      title: 'Prefrontal Cortex',
      biology: 'Executive function',
      skillTitle: 'System Architecture',
      description: 'Designing scalable systems',
    };

    useHotspotsStore.getState().setActiveHotspot(hotspot);
    expect(useHotspotsStore.getState().activeHotspot).toEqual(hotspot);
  });

  it('clearActiveHotspot resets to null', () => {
    useHotspotsStore.getState().setActiveHotspot({ id: 'test' });
    expect(useHotspotsStore.getState().activeHotspot).not.toBeNull();

    useHotspotsStore.getState().clearActiveHotspot();
    expect(useHotspotsStore.getState().activeHotspot).toBeNull();
  });
});

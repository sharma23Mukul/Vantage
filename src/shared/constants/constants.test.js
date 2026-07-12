import { describe, it, expect } from 'vitest';
import {
  SCROLL_EASE,
  CAMERA_FOV,
  MODEL_SCALE,
  ANIMATION_DEFAULTS,
  BREAKPOINTS,
  SITE_META,
  APP_NAME,
} from './index';
import { BRAIN_REGIONS } from '../../entities/brainModel/brainRegionsData';

describe('shared constants', () => {
  it('BREAKPOINTS has expected keys with numeric values', () => {
    expect(BREAKPOINTS).toHaveProperty('sm');
    expect(BREAKPOINTS).toHaveProperty('md');
    expect(BREAKPOINTS).toHaveProperty('lg');
    expect(BREAKPOINTS).toHaveProperty('xl');
    Object.values(BREAKPOINTS).forEach((val) => {
      expect(typeof val).toBe('number');
    });
  });

  it('ANIMATION_DEFAULTS has duration and ease', () => {
    expect(ANIMATION_DEFAULTS).toHaveProperty('duration');
    expect(ANIMATION_DEFAULTS).toHaveProperty('ease');
    expect(typeof ANIMATION_DEFAULTS.duration).toBe('number');
    expect(ANIMATION_DEFAULTS.ease).toBe(SCROLL_EASE);
  });

  it('SITE_META has title and tagline strings', () => {
    expect(typeof SITE_META.title).toBe('string');
    expect(typeof SITE_META.tagline).toBe('string');
    expect(SITE_META.title.length).toBeGreaterThan(0);
  });

  it('APP_NAME matches SITE_META.title', () => {
    expect(APP_NAME).toBe(SITE_META.title);
  });

  it('CAMERA_FOV and MODEL_SCALE are positive numbers', () => {
    expect(CAMERA_FOV).toBeGreaterThan(0);
    expect(MODEL_SCALE).toBeGreaterThan(0);
  });
});

describe('brain regions data', () => {
  it('exports exactly 5 regions', () => {
    expect(BRAIN_REGIONS).toHaveLength(5);
  });

  it('each region has required fields', () => {
    BRAIN_REGIONS.forEach((region) => {
      expect(region).toHaveProperty('id');
      expect(region).toHaveProperty('name');
      expect(region).toHaveProperty('biology');
      expect(region).toHaveProperty('skillTitle');
      expect(region).toHaveProperty('skillDescription');
      expect(region).toHaveProperty('position');
      expect(region.position).toHaveLength(3);
      region.position.forEach((coord) => {
        expect(typeof coord).toBe('number');
      });
    });
  });

  it('all region IDs are unique', () => {
    const ids = BRAIN_REGIONS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

import { useState, useEffect } from 'react';
import { getGPUTier } from 'detect-gpu';

/**
 * Quality tiers for adaptive rendering.
 *
 * high   — Full shaders, Bloom, 4 lights, DPR up to 2
 * medium — Reduced FBM, no Bloom, 2 lights, DPR capped at 1.5
 * low    — Flat shaders, 1 light, DPR 1, no antialias
 */
export const TIER_CONFIG = {
  high: {
    dpr: [1, 2],
    antialias: true,
    bloom: true,
    lightCount: 4,
    envMap: true,
    shaderQuality: 2,   // full FBM (4 octaves) + veins + mottling
    materialLayers: 3,   // core + inner + outer
  },
  medium: {
    dpr: [1, 1.5],
    antialias: true,
    bloom: false,
    lightCount: 2,
    envMap: false,
    shaderQuality: 1,   // reduced FBM (2 octaves), no veins
    materialLayers: 2,   // core + outer
  },
  low: {
    dpr: [1, 1],
    antialias: false,
    bloom: false,
    lightCount: 1,
    envMap: false,
    shaderQuality: 0,   // flat color, Voronoi edge only
    materialLayers: 1,   // outer only
  },
};

/**
 * Detects the GPU tier and returns a quality config.
 * Falls back to 'medium' if detection fails.
 */
export function useDeviceTier() {
  const [tier, setTier] = useState('medium');
  const [config, setConfig] = useState(TIER_CONFIG.medium);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await getGPUTier();
        if (cancelled) return;

        // detect-gpu returns tier 0-3 (0 = failed/blocklisted, 1 = low, 2 = mid, 3 = high)
        let detected;
        if (result.tier >= 3) {
          detected = 'high';
        } else if (result.tier >= 2) {
          detected = 'medium';
        } else {
          detected = 'low';
        }

        // Also check for mobile — cap at medium regardless of GPU tier
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile && detected === 'high') {
          detected = 'medium';
        }

        setTier(detected);
        setConfig(TIER_CONFIG[detected]);
      } catch {
        // Detection failed — stay on medium (safe default)
      }
    })();

    return () => { cancelled = true; };
  }, []);

  /**
   * Allows PerformanceMonitor to downgrade/upgrade at runtime.
   */
  const degradeTier = () => {
    setTier((prev) => {
      const next = prev === 'high' ? 'medium' : 'low';
      setConfig(TIER_CONFIG[next]);
      return next;
    });
  };

  const upgradeTier = () => {
    setTier((prev) => {
      const next = prev === 'low' ? 'medium' : 'high';
      setConfig(TIER_CONFIG[next]);
      return next;
    });
  };

  return { tier, config, degradeTier, upgradeTier };
}

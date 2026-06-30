import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven camera that smoothly orbits the brain
 * through 7 keyframe positions (one per page section).
 */
export function useScrollCamera() {
  const { camera } = useThree();

  useEffect(() => {
    // Initial camera setup
    camera.position.set(0, 0, 4.5);
    camera.lookAt(0, 0, 0);

    // Camera keyframes — one per scroll section
    const keyframes = [
      // 0: Hero → default front view
      { x: 0, y: 0, z: 4.5 },
      // 1: Prefrontal → front-right, slightly above
      { x: 2.5, y: 0.8, z: 3.5 },
      // 2: Parietal → above, looking down
      { x: 0.5, y: 3, z: 3 },
      // 3: Occipital → behind and slightly above
      { x: -2, y: 0.8, z: -3 },
      // 4: Temporal → side view
      { x: 4, y: 0, z: 0.5 },
      // 5: Cerebellum → low angle, front-ish
      { x: 1, y: -1.5, z: 3.5 },
      // 6: Contact → return to front
      { x: 0, y: 0, z: 4.5 },
    ];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.page-showcase',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5, // Smoother scrubbing with 1.5s ease
      },
    });

    // Build timeline with one keyframe per section
    // Each section takes equal weight (1 unit of timeline)
    const totalSections = keyframes.length - 1; // 6 transitions
    keyframes.forEach((kf, i) => {
      if (i === 0) return; // Skip first — that's the starting position
      tl.to(
        camera.position,
        {
          x: kf.x,
          y: kf.y,
          z: kf.z,
          ease: 'power2.inOut',
          duration: 1,
        },
        (i - 1) // Position in the timeline
      );
    });

    // Keep camera always looking at center during scroll
    tl.eventCallback('onUpdate', () => {
      camera.lookAt(0, 0, 0);
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [camera]);
}

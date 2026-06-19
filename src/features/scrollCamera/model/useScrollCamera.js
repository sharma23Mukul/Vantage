import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollCamera() {
  const { camera } = useThree();

  useEffect(() => {
    // Initial camera setup
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".page-showcase",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrubbing
      }
    });

    // Animate camera position along the scroll
    // Move right and slightly up
    tl.to(camera.position, {
      x: 3,
      y: 1,
      z: 4,
      ease: "power1.inOut"
    }, 0)
    // Move left and down
    .to(camera.position, {
      x: -3,
      y: -1,
      z: 3,
      ease: "power1.inOut"
    }, 1);

    // Ensure camera always looks at center during the scroll
    tl.eventCallback("onUpdate", () => {
      camera.lookAt(0, 0, 0);
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [camera]);
}

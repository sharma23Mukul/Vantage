import { useState, useEffect } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame;

    const tick = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      
      if (total > 0) {
        const pct = window.scrollY / total;
        // Clamp to prevent values out of bounds on mobile elastic scrolling
        setProgress(Math.max(0, Math.min(1, pct)));
      } else {
        setProgress(0);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}

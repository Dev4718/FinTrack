import { useState, useEffect } from 'react';

/**
 * Custom hook to animate number count-up on load.
 * Automatically disables motion if prefers-reduced-motion is detected.
 *
 * @param {number} targetValue - The final numeric value
 * @param {number} duration - Animation duration in ms (default 1200ms)
 * @returns {number} The current animated value
 */
export function useCountUp(targetValue, duration = 1200) {
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const initialValue =
    isReducedMotion || typeof targetValue !== 'number' || isNaN(targetValue) || targetValue === 0
      ? targetValue || 0
      : 0;

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (typeof targetValue !== 'number' || isNaN(targetValue) || targetValue === 0) {
      return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic curve for smooth natural deceleration
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(ease * targetValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setValue(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetValue, duration]);

  return value;
}

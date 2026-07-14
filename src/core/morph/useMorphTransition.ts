import { useCallback, useEffect, useRef, type RefObject } from 'react';
import type { MorphFrame } from './morph';

export interface MorphTransitionOptions {
  duration?: number;
  easing?: string;
}

export interface MorphTransitionControls {
  play: (frames: MorphFrame[]) => void;
}

const DEFAULT_DURATION = 300;
// Matches --lg-ease-bounce; WAAPI needs a concrete easing so the token value is
// mirrored here for this internal-only morph tool.
const DEFAULT_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Internal L0 morph hook (not exported publicly). Plays computeMorphFrames as a
 * Web Animations keyframe effect on the element, committing the end shape as
 * inline styles when it finishes. reduced-motion (or no WAAPI support) jumps
 * straight to the final frame.
 *
 * It only ever writes transform / border-radius — never size — so it does not
 * touch the filter registry; the refraction filter is never rebuilt per frame.
 */
export function useMorphTransition(
  ref: RefObject<HTMLElement | null>,
  options?: MorphTransitionOptions,
): MorphTransitionControls {
  const animationRef = useRef<Animation | null>(null);
  const duration = options?.duration ?? DEFAULT_DURATION;
  const easing = options?.easing ?? DEFAULT_EASING;

  const play = useCallback(
    (frames: MorphFrame[]) => {
      const element = ref.current;
      if (!element || frames.length === 0) {
        return;
      }
      const finalFrame = frames[frames.length - 1];

      animationRef.current?.cancel();
      animationRef.current = null;

      const applyFinal = () => {
        element.style.transform = finalFrame.transform;
        element.style.borderRadius = finalFrame.borderRadius;
      };

      if (prefersReducedMotion() || typeof element.animate !== 'function') {
        applyFinal();
        return;
      }

      const animation = element.animate(
        frames.map((frame) => ({ transform: frame.transform, borderRadius: frame.borderRadius })),
        { duration, easing, fill: 'forwards' },
      );
      animationRef.current = animation;
      animation.onfinish = () => {
        applyFinal();
        animation.cancel();
        animationRef.current = null;
      };
    },
    [ref, duration, easing],
  );

  useEffect(
    () => () => {
      animationRef.current?.cancel();
      animationRef.current = null;
    },
    [],
  );

  return { play };
}

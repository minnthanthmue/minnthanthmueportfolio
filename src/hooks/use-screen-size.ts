import { useState, useEffect, useCallback } from 'react';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const BREAKPOINTS: Record<Breakpoint, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export interface ScreenSize {
  width: number;
  height: number;
  lessThan: (breakpoint: Breakpoint) => boolean;
  greaterThan: (breakpoint: Breakpoint) => boolean;
}

/**
 * Responsive screen size hook with helper methods for breakpoint checks.
 */
export function useScreenSize(): ScreenSize {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const lessThan = useCallback(
    (breakpoint: Breakpoint) => {
      return windowSize.width < BREAKPOINTS[breakpoint];
    },
    [windowSize.width]
  );

  const greaterThan = useCallback(
    (breakpoint: Breakpoint) => {
      return windowSize.width >= BREAKPOINTS[breakpoint];
    },
    [windowSize.width]
  );

  return {
    width: windowSize.width,
    height: windowSize.height,
    lessThan,
    greaterThan,
  };
}

export default useScreenSize;

import React, { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  isAccent: boolean;
}

/**
 * Interactive full-page canvas dot background on pure white (#FFFFFF).
 * - Fixed full-page canvas behind content with pointer-events-none so it never blocks clicks.
 * - Varied sizes (about 1–5px diameter, 0.5–2.5px radius) and varied opacities (0.1–0.6).
 * - Uses #111111 for most dots, and a few of them the accent color (#2F4BFF) at low opacity.
 * - Slow organic drift with gentle repulsion / easing away when cursor/touch is nearby.
 * - Handles devicePixelRatio scaling, resize events, and document visibility changes.
 * - Respects prefers-reduced-motion by rendering dots statically without animation.
 * - Performant with requestAnimationFrame and paused when the tab is hidden.
 */
export const Backdrop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Check prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = reducedMotionQuery.matches;

    // Pointer state tracking on window so canvas can be pointer-events-none
    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
    };

    // Sensible dot count based on viewport area
    const getDotCount = (w: number, h: number) => {
      const area = w * h;
      return Math.min(130, Math.max(60, Math.floor(area / 14000)));
    };

    let dots: Dot[] = [];

    const initDots = () => {
      const count = getDotCount(width, height);
      dots = [];
      for (let i = 0; i < count; i++) {
        // Varied sizes: 1px to 5px diameter (0.5px to 2.5px radius)
        const radius = 0.5 + Math.random() * 2.0;
        // Varied opacities: 0.1 to 0.6
        const baseOpacity = 0.1 + Math.random() * 0.5;
        // Slow organic drift velocity
        const baseVx = (Math.random() - 0.5) * 0.28;
        const baseVy = (Math.random() - 0.5) * 0.28;
        // ~15% are accent colored (#2F4BFF) at low opacity
        const isAccent = Math.random() < 0.15;

        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          baseOpacity,
          vx: baseVx,
          vy: baseVy,
          baseVx,
          baseVy,
          isAccent,
        });
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initDots();
      if (isReducedMotion) {
        renderStatic();
      }
    };

    handleResize();

    // Radial visibility multiplier: lighter behind centered text, more visible near edges
    const getRadialMultiplier = (x: number, y: number) => {
      const nx = (x - width / 2) / (width / 2);
      const ny = (y - height / 2) / (height / 2);
      const dist = Math.min(1.4, Math.hypot(nx, ny));
      return Math.max(0.2, Math.min(1.15, 0.2 + dist * 0.85));
    };

    // Static render for reduced motion
    const renderStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const mult = getRadialMultiplier(dot.x, dot.y);
        const opacity = dot.baseOpacity * mult;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        // #111111 for most dots, #2F4BFF at low opacity for accent dots
        ctx.fillStyle = dot.isAccent
          ? `rgba(47, 75, 255, ${opacity * 0.65})`
          : `rgba(17, 17, 17, ${opacity})`;
        ctx.fill();
      }
    };

    // Animation loop with requestAnimationFrame
    const animate = () => {
      if (!isRunning || isReducedMotion) return;

      ctx.clearRect(0, 0, width, height);

      const interactionRadius = 140;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Cursor / touch proximity repulsion: gently move away with smooth easing
        if (pointer.active) {
          const dx = dot.x - pointer.x;
          const dy = dot.y - pointer.y;
          const dist = Math.hypot(dx, dy);

          if (dist > 0 && dist < interactionRadius) {
            const force = (1 - dist / interactionRadius) * 1.5;
            dot.vx += (dx / dist) * force * 0.3;
            dot.vy += (dy / dist) * force * 0.3;
          }
        }

        // Smooth damping back toward natural drift speed
        dot.vx = dot.vx * 0.94 + dot.baseVx * 0.06;
        dot.vy = dot.vy * 0.94 + dot.baseVy * 0.06;

        dot.x += dot.vx;
        dot.y += dot.vy;

        // Wrap around screen boundaries smoothly
        if (dot.x < -10) dot.x = width + 10;
        else if (dot.x > width + 10) dot.x = -10;

        if (dot.y < -10) dot.y = height + 10;
        else if (dot.y > height + 10) dot.y = -10;

        // Render dot: lighter behind text, more visible near edges
        const mult = getRadialMultiplier(dot.x, dot.y);
        const opacity = dot.baseOpacity * mult;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.isAccent
          ? `rgba(47, 75, 255, ${opacity * 0.65})`
          : `rgba(17, 17, 17, ${opacity})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    if (isReducedMotion) {
      renderStatic();
    } else {
      animationFrameId = requestAnimationFrame(animate);
    }

    // Pointer events on window so canvas remains pointer-events-none
    const handleMouseMove = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const handleMouseLeave = () => {
      pointer.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointer.x = e.touches[0].clientX;
        pointer.y = e.touches[0].clientY;
        pointer.active = true;
      }
    };

    const handleTouchEnd = () => {
      pointer.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Pause on hidden tab to save battery and CPU
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        isRunning = true;
        if (!isReducedMotion) {
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        cancelAnimationFrame(animationFrameId);
        renderStatic();
      } else {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none bg-[var(--bg)]"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  );
};

export default Backdrop;

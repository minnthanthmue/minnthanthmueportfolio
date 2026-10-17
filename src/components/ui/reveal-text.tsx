import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, MotionValue } from 'motion/react';

const REST_OPACITY = 0.3;
const REVEAL_SPAN = 0.8;
const WORD_WINDOW = 0.2;

function getWordRange(index: number, count: number): { start: number; end: number } {
  const start = count <= 1 ? 0 : (index / (count - 1)) * REVEAL_SPAN;
  const end = Math.min(1, start + WORD_WINDOW);
  return { start, end };
}

function calculateWordOpacity(progress: number, start: number, end: number): number {
  if (progress <= start) return REST_OPACITY;
  if (progress >= end) return 1;
  return REST_OPACITY + (1 - REST_OPACITY) * ((progress - start) / (end - start));
}

interface WordSpanProps {
  word: string;
  index: number;
  total: number;
  progressValue: MotionValue<number>;
  isFullyRevealed: boolean;
  prefersReducedMotion: boolean;
}

const WordSpan: React.FC<WordSpanProps> = React.memo(({
  word,
  index,
  total,
  progressValue,
  isFullyRevealed,
  prefersReducedMotion,
}) => {
  const { start, end } = useMemo(() => getWordRange(index, total), [index, total]);

  const opacity = useTransform(progressValue, (latest: number) => {
    return calculateWordOpacity(latest, start, end);
  });

  if (prefersReducedMotion || isFullyRevealed) {
    return (
      <span aria-hidden="true" style={{ opacity: 1 }}>
        {word}
      </span>
    );
  }

  return (
    <motion.span
      aria-hidden="true"
      style={{ opacity }}
    >
      {word}
    </motion.span>
  );
});

WordSpan.displayName = 'WordSpan';

export type RevealTag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

export interface RevealTextProps {
  children: string;
  as?: RevealTag;
  className?: string;
}

export const RevealText: React.FC<RevealTextProps> = React.memo(({
  children,
  as: Component = 'p',
  className = '',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Maximum scroll progress reached so far (one-way latch)
  const maxProgress = useMotionValue(0);

  // Determine mobile vs desktop offset
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const offsetConfig: any = isMobile ? ['start 1', 'end 0.7'] : ['start 0.95', 'end 0.6'];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: offsetConfig,
  });

  useEffect(() => {
    // Reduced motion check
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
      setIsFullyRevealed(true);
      return;
    }

    const checkViewportStatus = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // If block is already past end point or inside viewport, reveal fully
      if (rect.bottom <= vh * (isMobile ? 0.7 : 0.6) || rect.top < 0) {
        maxProgress.set(1);
        setIsFullyRevealed(true);
      }
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(checkViewportStatus);
    } else {
      checkViewportStatus();
    }

    window.addEventListener('resize', checkViewportStatus);
    window.addEventListener('orientationchange', checkViewportStatus);

    // One-way progress tracking
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const clamped = Math.max(0, Math.min(1, latest));
      if (clamped > maxProgress.get()) {
        maxProgress.set(clamped);
        if (clamped >= 1) {
          setIsFullyRevealed(true);
        }
      }
    });

    // Safety net: if visible for 1.5s and not fully revealed, finish gracefully with a 300ms fade
    const safetyNetTimer = window.setTimeout(() => {
      setIsFullyRevealed(true);
      maxProgress.set(1);
    }, 1500);

    return () => {
      window.removeEventListener('resize', checkViewportStatus);
      window.removeEventListener('orientationchange', checkViewportStatus);
      unsubscribe();
      window.clearTimeout(safetyNetTimer);
    };
  }, [scrollYProgress, maxProgress, isMobile]);

  // Words split
  const words = useMemo(() => {
    if (!children) return [];
    return children.trim().split(/\s+/);
  }, [children]);

  const Tag = Component as any;

  return (
    <Tag
      ref={containerRef}
      className={className}
      aria-label={children}
    >
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <WordSpan
            word={word}
            index={index}
            total={words.length}
            progressValue={maxProgress}
            isFullyRevealed={isFullyRevealed}
            prefersReducedMotion={prefersReducedMotion}
          />
          {index < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </Tag>
  );
});

RevealText.displayName = 'RevealText';

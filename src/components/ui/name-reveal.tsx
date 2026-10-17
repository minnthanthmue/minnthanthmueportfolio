import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';

interface NameRevealProps {
  name: string;
  className?: string;
  onProgress70?: () => void;
  onComplete?: () => void;
}

export const NameReveal: React.FC<NameRevealProps> = ({
  name,
  className = '',
  onProgress70,
  onComplete,
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const progressTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const safetyNetTimerRef = useRef<number | null>(null);

  // Compute characters and positions relative to center
  const { wordsData } = useMemo(() => {
    const rawWords = name.split(' ');
    const totalLen = name.length;
    const center = (totalLen - 1) / 2;

    let charCounter = 0;
    const words = rawWords.map((word, wordIndex) => {
      const isLastWord = wordIndex === rawWords.length - 1;
      const letters = word.split('').map((char) => {
        const charIndex = charCounter;
        charCounter++;
        const distance = Math.abs(charIndex - center);
        const delaySeconds = (distance * 35) / 1000; // distance * 35ms
        return { char, delaySeconds };
      });
      charCounter++; // for space
      return { word, letters, isLastWord };
    });

    return { wordsData: words };
  }, [name]);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
      setIsFinished(true);
      onProgress70?.();
      onComplete?.();
      return;
    }

    // Wait for fonts to be ready before starting animation
    const startAnimation = () => {
      // Small 100ms offset after photo begins
      const startTimer = window.setTimeout(() => {
        setHasStarted(true);

        // Notify parent when name is about 70% done (~750ms)
        progressTimerRef.current = window.setTimeout(() => {
          onProgress70?.();
        }, 750);

        // Completion callback (~1200ms)
        finishTimerRef.current = window.setTimeout(() => {
          setIsFinished(true);
          onComplete?.();
        }, 1250);
      }, 100);

      // Safety net: force final state within 2.0s
      safetyNetTimerRef.current = window.setTimeout(() => {
        setIsFinished(true);
        onProgress70?.();
        onComplete?.();
      }, 2000);

      return () => {
        window.clearTimeout(startTimer);
      };
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(startAnimation);
    } else {
      startAnimation();
    }

    return () => {
      if (progressTimerRef.current) window.clearTimeout(progressTimerRef.current);
      if (finishTimerRef.current) window.clearTimeout(finishTimerRef.current);
      if (safetyNetTimerRef.current) window.clearTimeout(safetyNetTimerRef.current);
    };
  }, [onProgress70, onComplete]);

  // Reduced motion: plain name at full opacity
  if (prefersReducedMotion || isFinished) {
    return (
      <span aria-label={name} className={className}>
        {wordsData.map((wordObj, wIdx) => (
          <React.Fragment key={wIdx}>
            <span className="inline-block">
              {wordObj.word}
            </span>
            {wIdx < wordsData.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </span>
    );
  }

  return (
    <span aria-label={name} className={className}>
      {wordsData.map((wordObj, wIdx) => (
        <React.Fragment key={wIdx}>
          <span className="inline-block">
            {wordObj.letters.map((letterObj, lIdx) => (
              <span
                key={lIdx}
                className="inline-block overflow-hidden align-baseline py-[0.12em]"
                aria-hidden="true"
              >
                <motion.span
                  initial={{
                    y: '0.6em',
                    opacity: 0,
                    filter: 'blur(6px)',
                  }}
                  animate={
                    hasStarted
                      ? {
                          y: '0em',
                          opacity: 1,
                          filter: 'blur(0px)',
                        }
                      : {
                          y: '0.6em',
                          opacity: 0,
                          filter: 'blur(6px)',
                        }
                  }
                  transition={{
                    duration: 0.7,
                    delay: letterObj.delaySeconds,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                  style={{ willChange: hasStarted && !isFinished ? 'transform, opacity, filter' : 'auto' }}
                >
                  {letterObj.char}
                </motion.span>
              </span>
            ))}
          </span>
          {wIdx < wordsData.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </span>
  );
};

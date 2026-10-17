import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface TextScrambleProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  highlightWord?: string;
  highlightColorClass?: string;
  align?: 'left' | 'center' | 'right';
}

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_#@%&+-=';

/**
 * TextScramble provides an accessible scramble animation that decodes
 * from left to right on page load and again on hover.
 * Avoids layout shift by using a dual-layer approach where an invisible sizer
 * preserves the exact natural dimensions of the final string.
 * Supports highlighting a specific word (e.g. "Hmue" in #2F4BFF) once resolved.
 */
export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  className = '',
  as: Component = 'span',
  highlightWord,
  highlightColorClass = 'text-[#2F4BFF]',
  align = 'center',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isResolved, setIsResolved] = useState(false);
  const isRunningRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  const scramble = useCallback(() => {
    if (isRunningRef.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(text);
      setIsResolved(true);
      return;
    }

    isRunningRef.current = true;
    setIsResolved(false);
    let iteration = 0;
    const totalChars = text.length;
    // Each character spends ~2.5 animation frames scrambling before resolving left to right
    const speed = 2.5;

    const tick = () => {
      iteration++;
      const resolvedCount = Math.floor(iteration / speed);

      const next = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < resolvedCount) {
            return text[index];
          }
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join('');

      setDisplayText(next);

      if (resolvedCount <= totalChars) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayText(text);
        setIsResolved(true);
        isRunningRef.current = false;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [text]);

  useEffect(() => {
    // Run on initial page load
    const timer = setTimeout(() => {
      scramble();
    }, 120);

    return () => {
      clearTimeout(timer);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [scramble]);

  const handleMouseEnter = () => {
    scramble();
  };

  const wordIndex = highlightWord ? text.lastIndexOf(highlightWord) : -1;

  const alignClass =
    align === 'center'
      ? 'justify-center text-center'
      : align === 'right'
      ? 'justify-end text-right'
      : 'justify-start text-left';

  return (
    <Component
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      aria-label={text}
    >
      {/* Invisible anchor text to preserve exact natural bounding box and prevent layout shift */}
      <span className="invisible select-none pointer-events-none" aria-hidden="true">
        {wordIndex !== -1 && highlightWord ? (
          <>
            <span>{text.slice(0, wordIndex)}</span>
            <span className={highlightColorClass}>{highlightWord}</span>
            <span>{text.slice(wordIndex + highlightWord.length)}</span>
          </>
        ) : (
          text
        )}
      </span>

      {/* Absolute overlay rendering the scrambled-to-resolved text with identical alignment */}
      <span
        className={`absolute inset-0 flex items-center select-none ${alignClass}`}
        aria-hidden="true"
      >
        {wordIndex !== -1 && highlightWord ? (
          <>
            <span>{displayText.slice(0, wordIndex)}</span>
            <span
              className={`transition-colors duration-300 ${
                isResolved ? highlightColorClass : 'text-[#111111]'
              }`}
            >
              {displayText.slice(wordIndex, wordIndex + highlightWord.length)}
            </span>
            <span>{displayText.slice(wordIndex + highlightWord.length)}</span>
          </>
        ) : (
          displayText
        )}
      </span>
    </Component>
  );
};

export default TextScramble;

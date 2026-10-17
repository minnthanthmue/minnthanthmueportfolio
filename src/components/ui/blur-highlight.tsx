import React, {
  useRef,
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
  Children,
  isValidElement,
} from 'react';
import { motion, useInView, useReducedMotion, type Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface HighlightBit {
  text: string;
  occurrence?: number;
}

export interface BlurHighlightProps {
  children?: React.ReactNode;
  text?: string;
  highlightedBits?: (string | HighlightBit)[];
  highlightColor?: string;
  highlightClassName?: string;
  blurAmount?: number;
  inactiveOpacity?: number;
  blurDelay?: number;
  blurDuration?: number;
  highlightDelay?: number;
  highlightDuration?: number;
  highlightDirection?: 'left' | 'right' | 'top' | 'bottom';
  viewportOptions?: {
    once?: boolean;
    amount?: number | 'some' | 'all';
    margin?: string;
  };
  containerClassName?: string;
  className?: string;
}

export interface BlurHighlightRef {
  trigger: () => void;
  reset: () => void;
}

interface HighlightedSpanProps {
  text: string;
  directionConfig: {
    initial: string;
    animated: string;
    position: string;
  };
  highlightColor: string;
  highlightClassName?: string;
  transition: Transition;
  shouldReduceMotion: boolean | null;
}

const HighlightedSpan: React.FC<HighlightedSpanProps> = ({
  text,
  directionConfig,
  highlightColor,
  highlightClassName,
  transition,
  shouldReduceMotion,
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const isWordInView = useInView(spanRef, {
    once: false,
    initial: false,
    amount: 0.1,
  });

  const isHighlighted = Boolean(shouldReduceMotion || isWordInView);

  const style: React.CSSProperties = {
    backgroundImage: `linear-gradient(${highlightColor}, ${highlightColor})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: directionConfig.position,
    backgroundSize: isHighlighted ? directionConfig.animated : directionConfig.initial,
    boxDecorationBreak: 'clone',
    WebkitBoxDecorationBreak: 'clone',
  };

  return (
    <span ref={spanRef} className="highlight-text-wrapper inline">
      <motion.span
        className={cn(
          'highlight-text-content py-[1px] px-1.5 rounded-[4px] font-medium text-[var(--text,#111111)] transition-colors duration-200',
          highlightClassName
        )}
        style={style}
        initial={{
          backgroundSize: shouldReduceMotion
            ? directionConfig.animated
            : directionConfig.initial,
        }}
        animate={{
          backgroundSize: isHighlighted
            ? directionConfig.animated
            : directionConfig.initial,
        }}
        transition={transition}
      >
        {text}
      </motion.span>
    </span>
  );
};

export const BlurHighlight = forwardRef<BlurHighlightRef, BlurHighlightProps>(
  (
    {
      children,
      text,
      highlightedBits = [],
      highlightColor = 'rgba(47, 75, 255, 0.18)',
      highlightClassName = '',
      blurAmount = 8,
      inactiveOpacity = 0.3,
      blurDelay = 0,
      blurDuration = 0.8,
      highlightDelay = 0.4,
      highlightDuration = 1.0,
      highlightDirection = 'left',
      viewportOptions = { once: false, amount: 0.3 },
      containerClassName = '',
      className = '',
    },
    ref
  ) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const [manualTrigger, setManualTrigger] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    // Intersection observer with default -20% margin as per React Bits specification
    const margin = viewportOptions.margin ?? '-10%';
    const amount = viewportOptions.amount ?? 0.3;
    const once = viewportOptions.once ?? false;

    const isInView = useInView(containerRef, {
      amount,
      once,
      margin: margin as any,
    });

    const active = Boolean(shouldReduceMotion || manualTrigger || isInView);

    useImperativeHandle(ref, () => ({
      trigger: () => setManualTrigger(true),
      reset: () => setManualTrigger(false),
    }));

    // Extract text from children or direct prop
    const rawText = useMemo(() => {
      if (typeof text === 'string') return text;
      if (typeof children === 'string') return children;
      if (!children) return '';
      return Children.toArray(children)
        .map((child) => {
          if (typeof child === 'string') return child;
          if (isValidElement(child)) {
            const childProps = child.props as { children?: unknown };
            if (typeof childProps.children === 'string') return childProps.children;
          }
          return '';
        })
        .join(' ');
    }, [children, text]);

    // Parse text into parts based on highlightedBits
    const { parts } = useMemo(() => {
      if (!rawText || highlightedBits.length === 0) {
        return { parts: [{ text: rawText, highlight: false }] };
      }

      const normalizedBits: HighlightBit[] = highlightedBits.map((bit) =>
        typeof bit === 'string' ? { text: bit, occurrence: undefined } : bit
      );

      const matches: Array<{
        start: number;
        end: number;
        text: string;
        occurrence: number;
      }> = [];

      normalizedBits.forEach((bit) => {
        const searchText = bit.text;
        if (!searchText) return;
        let searchIndex = 0;
        let occurrenceCount = 0;

        while (searchIndex < rawText.length) {
          const foundIndex = rawText.indexOf(searchText, searchIndex);
          if (foundIndex === -1) break;

          occurrenceCount++;
          if (bit.occurrence === undefined || bit.occurrence === occurrenceCount) {
            matches.push({
              start: foundIndex,
              end: foundIndex + searchText.length,
              text: searchText,
              occurrence: occurrenceCount,
            });
          }
          searchIndex = foundIndex + 1;
        }
      });

      matches.sort((a, b) => a.start - b.start);

      const resultParts: Array<{ text: string; highlight: boolean }> = [];
      let currentIndex = 0;

      matches.forEach((match, i) => {
        if (match.start > currentIndex) {
          resultParts.push({
            text: rawText.slice(currentIndex, match.start),
            highlight: false,
          });
        }

        if (i > 0 && match.start < matches[i - 1].end) {
          if (match.end > matches[i - 1].end) {
            resultParts.push({
              text: rawText.slice(matches[i - 1].end, match.end),
              highlight: true,
            });
            currentIndex = match.end;
          }
        } else {
          resultParts.push({
            text: rawText.slice(match.start, match.end),
            highlight: true,
          });
          currentIndex = match.end;
        }
      });

      if (currentIndex < rawText.length) {
        resultParts.push({
          text: rawText.slice(currentIndex),
          highlight: false,
        });
      }

      return { parts: resultParts };
    }, [rawText, highlightedBits]);

    const directionConfig = useMemo(() => {
      switch (highlightDirection) {
        case 'left':
        default:
          return { initial: '0% 100%', animated: '100% 100%', position: '0% 0%' };
        case 'right':
          return { initial: '0% 100%', animated: '100% 100%', position: '100% 0%' };
        case 'top':
          return { initial: '100% 0%', animated: '100% 100%', position: '0% 0%' };
        case 'bottom':
          return { initial: '100% 0%', animated: '100% 100%', position: '0% 100%' };
      }
    }, [highlightDirection]);

    const highlightSpringTransition: Transition = useMemo(() => {
      if (shouldReduceMotion) return { duration: 0 };
      return {
        type: 'spring',
        duration: highlightDuration,
        delay: highlightDelay,
        bounce: 0,
      };
    }, [shouldReduceMotion, highlightDuration, highlightDelay]);

    const finalClassName = cn(
      'blur-highlight-container block whitespace-pre-line',
      containerClassName,
      className
    );

    return (
      <motion.span
        ref={containerRef}
        style={{ display: 'block' }}
        initial={{
          opacity: shouldReduceMotion ? 1 : 0,
          filter: shouldReduceMotion ? 'blur(0px)' : `blur(${blurAmount}px)`,
        }}
        animate={
          shouldReduceMotion
            ? { opacity: 1, filter: 'blur(0px)' }
            : active
            ? { opacity: 1, filter: 'blur(0px)' }
            : { opacity: inactiveOpacity, filter: `blur(${0.75 * blurAmount}px)` }
        }
        transition={{
          duration: shouldReduceMotion ? 0 : blurDuration,
          delay: active ? blurDelay : 0,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className={finalClassName}
      >
        {parts.map((part, index) =>
          part.highlight ? (
            <HighlightedSpan
              key={`highlight-${index}-${part.text.slice(0, 10)}`}
              text={part.text}
              directionConfig={directionConfig}
              highlightColor={highlightColor}
              highlightClassName={highlightClassName}
              transition={highlightSpringTransition}
              shouldReduceMotion={shouldReduceMotion}
            />
          ) : (
            <React.Fragment key={`text-${index}`}>{part.text}</React.Fragment>
          )
        )}
      </motion.span>
    );
  }
);

BlurHighlight.displayName = 'BlurHighlight';

export default BlurHighlight;

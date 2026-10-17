"use client";

import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Image component compatible with next/image interface for Vite
function Image({
  src,
  alt = "",
  fill = false,
  className,
  ...props
}: {
  src: string;
  alt?: string;
  fill?: boolean;
  className?: string;
  [key: string]: any;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(fill ? "absolute inset-0 w-full h-full object-cover" : "", className)}
      loading="lazy"
      {...props}
    />
  );
}

export interface CardItem {
  src?: string;
  alt?: string;
  title?: string;
  description?: string;
  tags?: string[];
  link?: string;
}

export interface HomeSectionProps {
  category?: string;
  title?: string;
  subtitle?: string;
  cards?: CardItem[];
  className?: string;
}

export default function HomeSection({
  category = "Innovation Meets Simplicity",
  title = "Build Exceptional Interfaces",
  subtitle = "Use our component library powered by Shadcn UI & Tailwind CSS to craft beautiful, fast, and accessible UIs.",
  cards = [],
  className,
}: HomeSectionProps) {
  const totalCards = cards.length || 5;
  const placeholders: CardItem[] = Array.from({ length: totalCards }).map((_, i) => ({
    src: undefined,
    alt: `Project ${i + 1}`,
  }));

  const data = cards.length > 0 ? cards : placeholders;
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const animateCards = () => {
    if (!cardRefs.current.length) return;
    const middleIndex = Math.floor(data.length / 2);

    // Initial state
    gsap.set(cardRefs.current, {
      x: 0,
      scale: 0.5,
      opacity: 0,
      transformOrigin: "center bottom",
    });

    const tl = gsap.timeline({
      defaults: { duration: 0.6, ease: "power3.out" },
    });

    // Step 1 → Center card
    if (cardRefs.current[middleIndex]) {
      tl.to(cardRefs.current[middleIndex], {
        x: 0,
        scale: 1,
        opacity: 1,
      });
    }

    // Step 2+ → Left & Right pairs together
    for (let offset = 1; offset <= middleIndex; offset++) {
      const leftIndex = middleIndex - offset;
      const rightIndex = middleIndex + offset;

      const animations: gsap.TweenTarget[] = [];
      if (leftIndex >= 0 && cardRefs.current[leftIndex]) animations.push(cardRefs.current[leftIndex]);
      if (rightIndex < data.length && cardRefs.current[rightIndex])
        animations.push(cardRefs.current[rightIndex]);

      if (animations.length > 0) {
        tl.to(
          animations,
          {
            x: (_i, target) => {
              const idx = cardRefs.current.indexOf(target as HTMLDivElement);
              return (idx - middleIndex) * 120;
            },
            scale: (_i, target) => {
              const idx = cardRefs.current.indexOf(target as HTMLDivElement);
              return 1 - Math.abs(idx - middleIndex) * 0.1;
            },
            opacity: 1,
          },
          "+=0.1",
        );
      }
    }
  };

  useEffect(() => {
    animateCards();
  }, [activeIndex, data.length]);

  return (
    <section className={cn("py-12 md:py-16 px-4 transition-colors duration-300 w-full overflow-hidden", className)}>
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-4">
        {/* Category Button */}
        {category && (
          <Button
            showArrow={false}
            className="text-xs sm:text-sm font-medium shadow-none text-[var(--ink)] dark:text-white transition-colors duration-300 group relative inline-flex h-9 cursor-pointer items-center justify-center rounded-3xl border border-[var(--ink)]/15 bg-white/70 backdrop-blur-md px-4"
          >
            {category}
          </Button>
        )}

        {/* Heading */}
        {title && (
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-[var(--accent)] tracking-[-0.035em] transition-colors duration-300">
            {title}
          </h2>
        )}

        {/* Subheading */}
        {subtitle && (
          <p className="text-[var(--ink-2)] dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300 text-sm sm:text-base">
            {subtitle}
          </p>
        )}

        {/* Cards Row */}
        <div className="flex justify-center items-center relative h-[300px] sm:h-[340px] md:h-[380px] w-full max-w-4xl mx-auto my-6">
          {data.map((card, idx) => {
            const middleIndex = Math.floor(data.length / 2);
            const distance = Math.abs(idx - middleIndex);

            return (
              <div
                key={idx}
                ref={(el) => {
                  if (el) cardRefs.current[idx] = el;
                }}
                className="absolute cursor-pointer select-none transition-transform hover:-translate-y-2 duration-300"
                style={{
                  zIndex: data.length - distance,
                }}
                onClick={() => setActiveIndex(idx)}
              >
                <Card className="w-[85vw] max-w-[320px] sm:w-80 h-56 sm:h-64 md:h-72 bg-white/80 dark:bg-gray-800/90 backdrop-blur-md overflow-hidden transition-all duration-300 border border-[var(--ink)]/10 dark:border-gray-700 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-2xl relative">
                  <CardContent className="flex flex-col items-center justify-center p-0 h-full relative">
                    {card.src ? (
                      <Image
                        src={card.src}
                        alt={card.alt || `Card ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full p-6 flex flex-col justify-between items-start text-left bg-gradient-to-br from-white/95 to-[#FAFAF8] dark:from-gray-800 dark:to-gray-900">
                        <div className="w-8 h-8 rounded-full bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center text-xs font-bold font-mono">
                          0{idx + 1}
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-[var(--accent-strong)] text-base tracking-[-0.02em] mb-1">
                            {card.title || `Project 0${idx + 1}`}
                          </h4>
                          <p className="text-xs text-[var(--ink-3)] line-clamp-2">
                            {card.description || "In development — AI automation & web development."}
                          </p>
                        </div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-[#C2410C] font-semibold">
                          Coming Soon
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

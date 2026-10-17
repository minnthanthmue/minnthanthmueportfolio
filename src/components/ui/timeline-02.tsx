"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  badge?: string;
}

export interface TimelineProps {
  items?: TimelineItem[];
  className?: string;
}

export const defaultItems: TimelineItem[] = [
  {
    year: "2023",
    title: "Finished GED",
    description:
      "Successfully earned the General Educational Development (GED) credential with honors, establishing the comprehensive academic foundation to pursue international university degree studies.",
    badge: "Completed",
  },
  {
    year: "2024",
    title: "Enrolled at Tokyo International University",
    description:
      "Admitted and currently pursuing the Bachelor of Science in Digital Business & Innovation (DBI) in Tokyo, Japan. Developing skills across software development, practical machine learning, and AI pipelines.",
    badge: "In Progress",
    link: "https://www.tiu.ac.jp",
  },
  {
    year: "2028",
    title: "Expected Graduation Year",
    description:
      "Anticipated completion of Bachelor of Science in Digital Business & Innovation, ready to architect and deploy production web platforms, AI orchestrations, and intelligent data systems.",
    badge: "Expected",
  },
];

export const Timeline = ({
  items = defaultItems,
  className,
}: TimelineProps) => {
  const initialIndex = items.findIndex(
    (i) => i.badge?.toLowerCase().includes("progress") || i.year === "2024"
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
  const activeItem = items[activeIndex] || items[0];
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeRef = buttonRefs.current[activeIndex];
    if (activeRef) {
      activeRef.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeIndex]);

  if (!activeItem) return null;

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Year Pills Navigation Column */}
        <div className="relative flex flex-col items-center shrink-0 w-full lg:w-auto lg:col-span-2 col-span-12">
          <div
            className="flex flex-row lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar md:snap-y snap-x lg:py-2 px-1 w-full justify-start lg:justify-center items-center"
            style={{ scrollBehavior: "smooth" }}
            role="tablist"
            aria-label="Timeline years"
          >
            {items.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <Button
                  variant={isActive ? "default" : "outline"}
                  key={item.year}
                  ref={(el) => {
                    buttonRefs.current[index] = el as HTMLButtonElement | null;
                  }}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "rounded-full px-5 h-9 sm:h-10 transition-all duration-200 shrink-0 snap-center font-mono cursor-pointer border",
                    isActive
                      ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] border-[var(--accent)] shadow-xs"
                      : "bg-white text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] border-[var(--border)] hover:bg-[var(--surface)]"
                  )}
                  role="tab"
                  aria-selected={isActive}
                >
                  <span className="text-xs sm:text-sm font-semibold tracking-tight">
                    {item.year}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Content Panel (Text-only, spacious and intentional) */}
        <div className="flex-1 w-full lg:col-span-10 col-span-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.year}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full flex flex-col items-start gap-3.5 sm:gap-4 p-2 sm:p-4"
            >
              {/* Year Header & Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--text-primary)] tabular-nums">
                  {activeItem.year}
                </h2>
                {activeItem.badge && (
                  <Badge
                    variant="secondary"
                    className="rounded-full h-6 px-3 py-0.5 font-mono text-[11px] uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
                  >
                    {activeItem.badge}
                  </Badge>
                )}
              </div>

              {/* Milestone Title */}
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] leading-snug">
                {activeItem.title}
              </h3>

              {/* Milestone Description - WCAG AA compliant with var(--text-secondary) */}
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                {activeItem.description}
              </p>

              {/* Link */}
              {activeItem.link && (
                <div className="pt-2">
                  <a
                    href={activeItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-medium text-[var(--accent)] hover:underline transition-colors group select-none"
                  >
                    <span>View Institution</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)] transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Timeline;

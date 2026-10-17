import React from 'react';
import { siteContent, ToolCategory } from '@/data/content';
import { RevealText } from '@/components/ui/reveal-text';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedSection, AnimatedSectionItem } from '@/components/ui/animated-section';

export const ToolsSection: React.FC = () => {
  const { stack } = siteContent;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="stack" className="scroll-mt-24 py-[96px] lg:py-[144px]">
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left column (4 cols): Sticky mono label and heading on desktop */}
        <AnimatedSectionItem className="lg:col-span-4 lg:sticky lg:top-24 self-start">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)] mb-2 sm:mb-3 select-none">
            03 &nbsp;Stack
          </div>
          <RevealText as="h2" className="section-heading">
            {stack.heading}
          </RevealText>
        </AnimatedSectionItem>

        {/* Right column (8 cols): Standardized equal-sized cards across all categories */}
        <AnimatedSectionItem className="lg:col-span-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 auto-rows-fr">
            {stack.categories.map((group: ToolCategory, idx: number) => {
              return (
                <motion.div
                  key={group.category}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.5,
                          delay: Math.min(0.3, idx * 0.06),
                          ease: [0.22, 1, 0.36, 1],
                        }
                  }
                  className="rounded-[12px] p-5 border border-[var(--border)] bg-white shadow-xs transition-all duration-150 ease-out [@media(hover:hover)]:hover:-translate-y-[1px] [@media(hover:hover)]:hover:border-[var(--accent)] motion-reduce:transform-none flex flex-col justify-between h-full min-h-[220px]"
                >
                  {/* Top: Category label with item count */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]/60">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-2)] truncate">
                      {group.category}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)] shrink-0 ml-2">
                      {group.tools.length}
                    </span>
                  </div>

                  {/* Tools grid: Standardized 3-column layout */}
                  <div className="grid grid-cols-3 gap-x-2 gap-y-3.5 flex-1 content-start py-1">
                    {group.tools.map((tool) => (
                      <div
                        key={tool.name}
                        tabIndex={0}
                        role="img"
                        aria-label={`${tool.name} logo`}
                        className="tool-item-box group flex flex-col items-center justify-start text-center py-1 px-1 outline-none cursor-default select-none rounded focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                      >
                        <div className="h-5 w-5 flex items-center justify-center shrink-0">
                          {tool.logoSrc ? (
                            <img
                              src={tool.logoSrc}
                              alt={`${tool.name} logo`}
                              width={20}
                              height={20}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-contain filter group-hover:scale-110 transition-transform duration-150 pointer-events-none select-none motion-reduce:transition-none"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement | null;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            style={{ display: tool.logoSrc ? 'none' : 'flex' }}
                            className="h-5 w-5 rounded bg-[var(--surface)] text-[9px] font-mono font-bold items-center justify-center text-[var(--text-secondary)] border border-[var(--border)]"
                          >
                            {tool.name.slice(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <span className="mt-1.5 text-[11px] font-normal text-[var(--text-primary)] leading-tight tracking-tight line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                          {tool.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom: Proficiency badge indicator */}
                  <div className="pt-2 border-t border-[var(--border)]/40 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                      Tier
                    </span>
                    <span className="font-mono text-[10px] font-medium text-[var(--accent)] px-1.5 py-0.5 rounded bg-[var(--accent)]/10">
                      Active
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatedSectionItem>
      </AnimatedSection>
    </section>
  );
};

export default ToolsSection;

import React from 'react';
import { siteContent } from '@/data/content';
import { RevealText } from '@/components/ui/reveal-text';
import { Button } from '@/components/ui/button';

export const ExperienceSection: React.FC = () => {
  const { experience } = siteContent;

  return (
    <section id="experience" className="scroll-mt-24 py-[96px] lg:py-[144px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left column (4 cols): Sticky mono label and heading on desktop */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 self-start">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)] mb-2 sm:mb-3">
            05 &nbsp;Experience
          </div>
          <RevealText as="h2" className="section-heading">
            {experience.heading}
          </RevealText>
        </div>

        {/* Right column (8 cols): Standardized Experience Card matching design tokens */}
        <div className="lg:col-span-8 w-full max-w-[680px]">
          <div className="rounded-[12px] p-6 sm:p-7 border border-[var(--border)] bg-white shadow-xs flex flex-col justify-between min-h-[200px] w-full">
            <div>
              {/* Card Header: Category & Availability indicator */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)]/60">
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-2)]">
                  Status
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                  Open to Opportunities
                </span>
              </div>

              {/* Statement: Formatted cleanly with proper line-height */}
              <p className="text-[1.0625rem] sm:text-[1.125rem] font-normal text-[var(--text-primary)] leading-relaxed">
                {experience.statement}
              </p>
            </div>

            {/* Bottom Row: Aligned action row with note and button */}
            <div className="mt-6 pt-4 border-t border-[var(--border)]/70 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[var(--text-muted)] font-mono">
                Available for internships & entry-level roles
              </span>
              <Button
                variant="primary"
                href="#contact"
                showArrow
                className="w-auto h-9 px-4 text-xs"
              >
                {experience.ctaText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

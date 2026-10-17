import React from 'react';
import { siteContent } from '@/data/content';
import { RevealText } from '@/components/ui/reveal-text';
import { BlurHighlight } from '@/components/ui/blur-highlight';
import { AnimatedSection, AnimatedSectionItem } from '@/components/ui/animated-section';

const aboutBioText = `I am Minn Thant Hmue, a Digital Business & Innovation student at Tokyo International University. I am originally from Myanmar and currently live in Tokyo. I am interested in connecting technical development with product thinking, and I enjoy learning how to build fast, reliable web interfaces, machine learning models, and automated AI workflows.

I like software that is simple and does its job well. Instead of treating AI as a buzzword, I experiment with practical workflows using local language models through Ollama, n8n automations, and AI model APIs. Through these projects, I am learning how to turn repetitive manual tasks into small automated processes that run in the background.`;

const aboutHighlightedBits = [
  'Minn Thant Hmue',
  'Digital Business & Innovation',
  'Tokyo International University',
  'fast, reliable web interfaces, machine learning models, and automated AI workflows',
];

export const AboutSection: React.FC = () => {
  const { about } = siteContent;

  return (
    <section id="about" className="scroll-mt-24 py-[96px] lg:py-[144px]">
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left column (4 cols): Sticky mono label and heading on desktop */}
        <AnimatedSectionItem className="lg:col-span-4 lg:sticky lg:top-24 self-start">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)] mb-2 sm:mb-3 select-none">
            01 &nbsp;About
          </div>
          <RevealText as="h2" className="section-heading">
            {about.heading}
          </RevealText>
        </AnimatedSectionItem>

        {/* Right column (8 cols): Bio paragraph with Blur Highlight */}
        <AnimatedSectionItem className="lg:col-span-8 max-w-[65ch]">
          <BlurHighlight
            highlightedBits={aboutHighlightedBits}
            highlightColor="rgba(47, 75, 255, 0.16)"
            blurAmount={8}
            inactiveOpacity={0.3}
            blurDelay={0}
            blurDuration={0.8}
            highlightDelay={0.35}
            highlightDuration={0.9}
            highlightDirection="left"
            viewportOptions={{ once: false, amount: 0.2 }}
            className="text-[1rem] lg:text-[1.0625rem] font-normal text-[var(--text-2)] leading-[1.78]"
          >
            {aboutBioText}
          </BlurHighlight>
        </AnimatedSectionItem>
      </AnimatedSection>
    </section>
  );
};

export default AboutSection;

import React, { useState, useEffect, useRef } from 'react';
import { siteContent } from '@/data/content';
import { RevealText } from '@/components/ui/reveal-text';
import GlassFolder, { FolderFile } from '@/components/ui/glass-folder-cards';

export const WorkSection: React.FC = () => {
  const { projects } = siteContent;
  const hasProjects = projects.items && projects.items.length > 0;

  const sectionRef = useRef<HTMLElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const [folderWidth, setFolderWidth] = useState<number>(340);
  const [isNearViewport, setIsNearViewport] = useState<boolean>(false);

  // Measure available width in column: 340 on desktop, min(340, available width) on screens under 400px
  useEffect(() => {
    const updateWidth = () => {
      if (!columnRef.current) return;
      const available = columnRef.current.clientWidth;
      if (available > 0) {
        setFolderWidth(Math.min(340, Math.floor(available)));
      }
    };

    updateWidth();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && columnRef.current) {
      ro = new ResizeObserver(() => {
        updateWidth();
      });
      ro.observe(columnRef.current);
    }

    window.addEventListener('resize', updateWidth);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Performance: Lazy mount folder when Projects section is near viewport (300px margin)
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Prepare files array: exactly one paper sheet when empty; mapped array when populated
  const files: FolderFile[] = hasProjects
    ? projects.items.map((item) => ({
        name: item.title,
        meta: item.meta || 'Live',
        href: item.url,
      }))
    : [
        {
          name: 'Projects in progress',
          meta: 'Coming soon',
        },
      ];

  // Reserve full height (0.96 * width + 54px headroom) so there is no layout shift
  const reservedHeight = Math.round(0.96 * folderWidth + 54);

  return (
    <section ref={sectionRef} id="projects" className="scroll-mt-24 py-[96px] lg:py-[144px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left column (4 cols): Sticky mono label and heading on desktop */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 self-start">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)] mb-2 sm:mb-3">
            04 &nbsp;Projects
          </div>
          <RevealText as="h2" className="section-heading">
            {projects.heading}
          </RevealText>
        </div>

        {/* Right column (8 cols): Unboxed, pure folder design with generous breathing room */}
        <div ref={columnRef} className="lg:col-span-8 w-full max-w-[680px]">
          {/* Introductory status line */}
          <p className="text-[1.0625rem] sm:text-[1.125rem] font-normal text-[var(--text-primary)] leading-relaxed mb-6 max-w-[50ch]">
            {projects.placeholder.text}
          </p>

          {/* Interactive GlassFolder sitting directly on the backdrop without enclosing boxes */}
          <div
            className="relative flex items-center justify-start w-full overflow-visible py-2"
            style={{ minHeight: reservedHeight }}
          >
            {isNearViewport ? (
              <GlassFolder
                label="Projects"
                meta="Coming soon"
                tone="light"
                art="none"
                action="none"
                labelPlacement="bottom-left"
                appear={true}
                appearDelay={0}
                files={files}
                width={Math.min(folderWidth, 340)}
                style={{
                  fontFamily: 'var(--font-body)',
                  ['--gf-ink' as any]: 'var(--text-primary)',
                  ['--gf-ink-soft' as any]: 'var(--text-secondary)',
                }}
              />
            ) : (
              <div style={{ width: Math.min(folderWidth, 340), height: reservedHeight }} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;

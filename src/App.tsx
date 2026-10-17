import React, { useState, useEffect, useRef } from 'react';
import { Backdrop } from './components/Backdrop';
import { BottomNavBar } from './components/BottomNavBar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { EducationSection } from './components/EducationSection';
import { ToolsSection } from './components/ToolsSection';
import { WorkSection } from './components/WorkSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ArrowUp } from 'lucide-react';
import { SECTIONS_ORDER, SectionId } from './data/content';

const SECTION_COMPONENTS: Record<SectionId, React.ReactElement> = {
  top: <Hero key="top" />,
  about: <AboutSection key="about" />,
  education: <EducationSection key="education" />,
  stack: <ToolsSection key="stack" />,
  projects: <WorkSection key="projects" />,
  experience: <ExperienceSection key="experience" />,
  contact: <ContactSection key="contact" />,
};

export default function App() {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      setShowBackToTop(scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative text-[var(--ink)] page-fade-in overflow-x-clip">
      {/* 1. Skip link: visible on focus as first focusable element */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-white focus:text-[var(--text-primary)] focus:text-sm focus:font-semibold focus:rounded-full focus:shadow-[0_4px_12px_rgba(17,17,17,0.1)] focus:border focus:border-[var(--border)] focus:outline-2 focus:outline-[var(--accent)] focus:outline-offset-2"
      >
        Skip to content
      </a>

      {/* 2. Scroll Progress Bar: 2px single accent line at the very top of viewport (scaleX transform only) */}
      <div
        ref={progressBarRef}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--accent)] origin-left z-[100] pointer-events-none transform scale-x-0 will-change-transform motion-reduce:hidden"
      />

      {/* Fixed Full-Viewport Glass Backdrop with Soft Static Radial Orbs (reduced opacity) */}
      <Backdrop />

      {/* Main Container: 12-column grid system, container max-width 1040px, bottom padding for bottom nav */}
      <main
        id="main-content"
        className="w-full max-w-[1040px] mx-auto px-5 lg:px-10 overflow-x-clip pb-[calc(88px+env(safe-area-inset-bottom,0px))] sm:pb-[calc(96px+env(safe-area-inset-bottom,0px))]"
      >
        {/* Sections rendered dynamically from SECTIONS_ORDER in src/data/content.ts */}
        {SECTIONS_ORDER.map((section) => SECTION_COMPONENTS[section.id])}

        {/* Footer */}
        <Footer />
      </main>

      {/* Fixed Bottom Navigation Bar (mobile-optimized pill, safe-area inset, scroll-spy) */}
      <BottomNavBar />

      {/* 3. Back to Top: 44px circular button appearing after 600px scroll, elevated above bottom nav */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-[calc(76px+env(safe-area-inset-bottom,0px))] sm:bottom-[calc(82px+env(safe-area-inset-bottom,0px))] right-5 lg:right-10 z-30 w-11 h-11 rounded-full flex items-center justify-center bg-white border border-[var(--border)] shadow-[0_2px_10px_rgba(17,17,17,0.06)] hover:border-[var(--accent)] text-[var(--text-primary)] hover:text-[var(--accent)] transition-all duration-200 ease-out outline-none select-none focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 motion-reduce:transition-none cursor-pointer ${
          showBackToTop
            ? 'opacity-100 pointer-events-auto translate-y-0 scale-100'
            : 'opacity-0 pointer-events-none translate-y-2 scale-95'
        }`}
      >
        <ArrowUp size={18} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}

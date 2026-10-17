import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Home, User, GraduationCap, Layers, FolderKanban, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavItemConfig {
  id: string;
  name: string;
  targetId: string;
  icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'top', name: 'Home', targetId: 'top', icon: Home },
  { id: 'about', name: 'About', targetId: 'about', icon: User },
  { id: 'education', name: 'Education', targetId: 'education', icon: GraduationCap },
  { id: 'stack', name: 'Stack', targetId: 'stack', icon: Layers },
  { id: 'projects', name: 'Projects', targetId: 'projects', icon: FolderKanban },
  { id: 'contact', name: 'Contact', targetId: 'contact', icon: Mail },
];

export const BottomNavBar: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('top');
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 480;
    }
    return false;
  });
  const shouldReduceMotion = useReducedMotion();
  const isClickingRef = useRef(false);

  // Track viewport width <= 480px
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll-spy: Track active section in viewport
  useEffect(() => {
    const handleScroll = () => {
      if (isClickingRef.current) return;

      const scrollY = window.scrollY;
      if (scrollY < 120) {
        setActiveId('top');
        return;
      }

      // Check sections from bottom to top
      const sectionElements = NAV_ITEMS.map((item) => ({
        id: item.id,
        el: document.getElementById(item.targetId),
      })).filter((item): item is { id: string; el: HTMLElement } => item.el !== null);

      const scrollPosition = scrollY + window.innerHeight * 0.4;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, el } = sectionElements[i];
        const top = el.offsetTop;
        if (scrollPosition >= top) {
          setActiveId(id);
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string, id: string) => {
    e.preventDefault();
    setActiveId(id);
    isClickingRef.current = true;

    if (targetId === 'top') {
      window.scrollTo({
        top: 0,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({
          behavior: shouldReduceMotion ? 'auto' : 'smooth',
        });
      }
    }

    setTimeout(() => {
      isClickingRef.current = false;
    }, 800);
  };

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-[calc(12px+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-24px)] select-none pointer-events-auto"
      style={{ touchAction: 'manipulation' }}
    >
      <div
        className={cn(
          'flex items-center rounded-full bg-white/95 backdrop-blur-md border border-[#E7E5E0] shadow-[0_4px_20px_rgba(17,17,17,0.08)] transition-all duration-200',
          isMobile ? 'p-1 gap-[2px]' : 'p-1.5 gap-1'
        )}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          const Icon = item.icon;

          return (
            <a
              key={item.id}
              href={`#${item.targetId}`}
              onClick={(e) => handleNavClick(e, item.targetId, item.id)}
              aria-label={item.name}
              aria-current={isActive ? 'page' : undefined}
              title={item.name}
              style={{ touchAction: 'manipulation' }}
              className={cn(
                'relative flex items-center justify-center rounded-full transition-all duration-200 outline-none cursor-pointer',
                'focus-visible:ring-2 focus-visible:ring-[#2F4BFF] focus-visible:ring-offset-2',
                isMobile
                  ? 'w-10 h-10 min-w-[40px] min-h-[40px]'
                  : isActive
                  ? 'h-11 min-h-[44px] px-3.5'
                  : 'w-11 h-11 min-w-[44px] min-h-[44px]',
                isActive
                  ? 'text-[#2F4BFF] bg-[#2F4BFF]/10 font-medium'
                  : 'text-[#9A9A93] hover:text-[#111111] hover:bg-[#F7F7F5]'
              )}
            >
              <Icon
                size={isMobile ? 20 : 22}
                className={cn(
                  'shrink-0 transition-transform duration-150',
                  isActive ? 'scale-105' : 'hover:scale-105'
                )}
                aria-hidden={true}
              />

              {/* At 481px and above: active item expands to show label (max 72px) */}
              {!isMobile && isActive && (
                <motion.span
                  initial={shouldReduceMotion ? { opacity: 1, width: 'auto' } : { opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={shouldReduceMotion ? { opacity: 1, width: 'auto' } : { opacity: 0, width: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
                  className="overflow-hidden whitespace-nowrap pl-1.5 text-xs font-medium tracking-wide max-w-[72px] truncate"
                >
                  {item.name}
                </motion.span>
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;

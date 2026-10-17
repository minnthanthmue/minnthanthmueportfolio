"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowUpRight, Compass, Mail, Github, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
  href: string;
  id?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
}

export const defaultNavItems: NavItem[] = [
  { name: "Home", href: "#top", id: "top" },
  { name: "About", href: "#about", id: "about" },
  { name: "Education", href: "#education", id: "education" },
  { name: "Stack", href: "#stack", id: "stack" },
  { name: "Projects", href: "#projects", id: "projects" },
  { name: "Experience", href: "#experience", id: "experience" },
  { name: "Contact", href: "#contact", id: "contact" },
];

const SECTION_INDEX_MAP: Record<string, string> = {
  top: "00",
  about: "01",
  education: "02",
  stack: "03",
  projects: "04",
  experience: "05",
  contact: "06",
};

export interface AnimatedNavFramerProps {
  items?: NavItem[];
  activeId?: string;
  onItemClick?: (href: string) => void;
  className?: string;
}

export function AnimatedNavFramer({
  items = defaultNavItems,
  activeId,
  onItemClick,
  className,
}: AnimatedNavFramerProps) {
  const [internalActive, setInternalActive] = React.useState<string>(items[0]?.id || "top");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  const currentActive = activeId || internalActive;

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setMobileMenuOpen(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [mobileMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    setInternalActive(id);
    setMobileMenuOpen(false);

    if (onItemClick) {
      onItemClick(href);
      return;
    }

    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeItemObj = items.find((item) => (item.id || item.href.replace("#", "")) === currentActive) || items[0];

  return (
    <>
      {/* =========================================================================
          DESKTOP NAVIGATION (Visible on screens >= 768px)
          Centered floating pill with active background bubble
          ========================================================================= */}
      <div className={cn("hidden md:block fixed top-5 left-1/2 -translate-x-1/2 z-50 select-none", className)}>
        <nav
          aria-label="Desktop Navigation"
          className="flex items-center gap-1 p-1.5 px-2 rounded-full border border-[var(--border)] bg-white/90 shadow-[0_4px_24px_rgba(17,17,17,0.06)] backdrop-blur-xl"
        >
          {/* Logo / Home jump button */}
          <a
            href="#top"
            onClick={(e) => handleLinkClick(e, "#top")}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--surface)] text-[var(--accent)] hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--accent)] shrink-0 mr-1"
            aria-label="Back to top"
            title="Minn Thant Hmue"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
          </a>

          {/* Section links */}
          <ul className="flex items-center gap-0.5">
            {items.map((item) => {
              const itemId = item.id || item.href.replace("#", "");
              const isActive = currentActive === itemId;

              return (
                <li key={item.name} className="shrink-0">
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={cn(
                      "relative flex items-center justify-center px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-1 min-h-[36px]",
                      isActive
                        ? "text-[var(--accent)] font-semibold"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBubble"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 380, damping: 30 }
                        }
                        className="absolute inset-0 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 -z-0"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* =========================================================================
          MOBILE NAVIGATION (Visible on screens < 768px)
          Clean floating top header pill + responsive full-featured dropdown menu
          ========================================================================= */}
      <div className="md:hidden fixed top-3 left-3 right-3 z-50 max-w-[420px] mx-auto select-none">
        <header
          className={cn(
            "flex items-center justify-between px-3.5 py-2 rounded-full border border-[var(--border)] bg-white/95 shadow-[0_4px_20px_rgba(17,17,17,0.07)] backdrop-blur-xl transition-all duration-200",
            className
          )}
        >
          {/* Left: Brand Monogram / Jump to Top */}
          <a
            href="#top"
            onClick={(e) => handleLinkClick(e, "#top")}
            className="flex items-center gap-2 text-left group min-h-[44px] min-w-[44px] -ml-1 pl-1 pr-2 rounded-full focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            aria-label="Scroll to top of portfolio"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] group-hover:scale-105 transition-transform shrink-0">
              <Compass size={15} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[var(--text-primary)] leading-tight tracking-tight">
                Minn
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                Portfolio
              </span>
            </div>
          </a>

          {/* Center: Current Active Section Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)]/70">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider font-medium text-[var(--text-secondary)] truncate max-w-[100px]">
              {activeItemObj.name}
            </span>
          </div>

          {/* Right: Hamburger / Close Toggle Button (44px min tap target) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className="flex items-center justify-center w-11 h-11 -mr-1.5 rounded-full text-[var(--text-primary)] hover:bg-[var(--surface)] active:bg-[var(--border)]/60 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X size={20} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Menu size={20} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </header>

        {/* Mobile Dropdown Sheet */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Dimmed backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 cursor-pointer"
                aria-hidden="true"
              />

              {/* Menu Card */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
                className="relative z-50 mt-2 p-4 rounded-3xl bg-white border border-[var(--border)] shadow-2xl overflow-hidden"
              >
                {/* Header label in menu */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--border)]/70">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                    Navigation
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    7 Sections
                  </span>
                </div>

                {/* Section Items list (Vertical, 48px tap target per item) */}
                <nav aria-label="Mobile Sections List">
                  <ul className="flex flex-col gap-1">
                    {items.map((item) => {
                      const itemId = item.id || item.href.replace("#", "");
                      const isActive = currentActive === itemId;
                      const indexLabel = SECTION_INDEX_MAP[itemId] || "•";

                      return (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            onClick={(e) => handleLinkClick(e, item.href)}
                            className={cn(
                              "flex items-center justify-between w-full px-3.5 py-3 rounded-xl min-h-[48px] transition-all text-sm font-medium",
                              isActive
                                ? "bg-[var(--accent)]/10 text-[var(--accent)] font-semibold border border-[var(--accent)]/20"
                                : "text-[var(--text-primary)] hover:bg-[var(--surface)] hover:text-[var(--accent)]"
                            )}
                            aria-current={isActive ? "page" : undefined}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "font-mono text-xs",
                                  isActive ? "text-[var(--accent)] font-bold" : "text-[var(--text-muted)]"
                                )}
                              >
                                {indexLabel}
                              </span>
                              <span>{item.name}</span>
                            </div>

                            {isActive ? (
                              <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />
                            ) : (
                              <ArrowUpRight
                                size={14}
                                className="text-[var(--text-muted)] opacity-60"
                                aria-hidden="true"
                              />
                            )}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Quick Social & Contact Footer */}
                <div className="mt-4 pt-3 border-t border-[var(--border)]/70 flex items-center justify-between px-1">
                  <a
                    href="mailto:minnthanthmue04@gmail.com"
                    className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors py-1.5 min-h-[44px]"
                  >
                    <Mail size={14} />
                    <span>minnthanthmue04@gmail.com</span>
                  </a>

                  <div className="flex items-center gap-1">
                    <a
                      href="https://github.com/minnthanthmue"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub Profile"
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors"
                    >
                      <Github size={16} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/minn-thant-hmue"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn Profile"
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors"
                    >
                      <Linkedin size={16} />
                    </a>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export const NavigationMenu = AnimatedNavFramer;

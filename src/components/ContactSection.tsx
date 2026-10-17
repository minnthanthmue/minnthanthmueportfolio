import React, { useState, useEffect, useRef } from 'react';
import { siteContent } from '@/data/content';
import { RevealText } from '@/components/ui/reveal-text';
import { Button } from '@/components/ui/button';
import { Mail, Github, Linkedin, ArrowUpRight, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';

const CONTACT_ICONS = {
  email: Mail,
  github: Github,
  linkedin: Linkedin,
};

export const ContactSection: React.FC = () => {
  const { contact } = siteContent;
  const [copied, setCopied] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyEmail = (e: React.MouseEvent, emailValue: string) => {
    e.preventDefault();
    e.stopPropagation();

    const doCopy = async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailValue);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = emailValue;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        setCopied(true);
        setLiveAnnouncement('Email copied');

        if (copyTimerRef.current) {
          window.clearTimeout(copyTimerRef.current);
        }
        copyTimerRef.current = window.setTimeout(() => {
          setCopied(false);
          setLiveAnnouncement('');
        }, 1500);
      } catch {
        // Fallback gracefully
      }
    };

    doCopy();
  };

  return (
    <section id="contact" className="scroll-mt-24 py-[96px] lg:py-[144px]">
      {/* Aria-live region for screen reader announcements */}
      <div aria-live="polite" className="sr-only">
        {liveAnnouncement}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left column (4 cols): Sticky mono label and heading on desktop */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 self-start">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)] mb-2 sm:mb-3">
            06 &nbsp;Contact
          </div>
          <RevealText as="h2" className="section-heading">
            {contact.heading}
          </RevealText>
        </div>

        {/* Right column (8 cols): Three boxes in a row on desktop, stacked on mobile */}
        <div className="lg:col-span-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {contact.items.map((item, idx) => {
              const Icon = CONTACT_ICONS[item.type];
              const isEmail = item.type === 'email';

              return (
                <motion.a
                  key={item.type}
                  href={item.href}
                  target={!isEmail ? '_blank' : undefined}
                  rel={!isEmail ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative flex flex-col justify-between min-h-[110px] p-5 rounded-[12px] bg-white border border-[var(--border)] shadow-[0_2px_8px_rgba(17,17,17,0.04)] transition-all duration-150 ease-out [@media(hover:hover)]:hover:-translate-y-[1px] [@media(hover:hover)]:hover:border-[var(--accent)] outline-none select-none focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 motion-reduce:transform-none"
                >
                  {/* Top row: Icon and action button (Copy or Arrow) */}
                  <div className="flex items-center justify-between gap-2">
                    <Icon size={18} strokeWidth={1.5} className="text-[var(--text-primary)] shrink-0" aria-hidden="true" />

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isEmail && (
                        <button
                          type="button"
                          onClick={(e) => handleCopyEmail(e, item.value)}
                          aria-label={copied ? 'Email copied' : 'Copy email address'}
                          title={copied ? 'Copied!' : 'Copy email'}
                          className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--text-primary)] transition-colors outline-none focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer"
                        >
                          {copied ? (
                            <Check size={14} strokeWidth={2} className="text-[#10B981]" aria-hidden="true" />
                          ) : (
                            <Copy size={13} strokeWidth={1.5} aria-hidden="true" />
                          )}
                        </button>
                      )}

                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.5}
                        className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-all duration-150 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px] shrink-0 motion-reduce:transform-none"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Bottom: Label and Value */}
                  <div className="mt-4 flex flex-col min-w-0">
                    <span className="text-[0.6875rem] font-mono font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                      {item.label}
                    </span>
                    <span className="text-[0.875rem] font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors break-anywhere mt-0.5">
                      {item.value}
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Action row below the boxes: "Email" Primary button */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              href={contact.items.find((i) => i.type === 'email')?.href || 'mailto:minnthanthmue04@gmail.com'}
              showArrow
              className="w-auto"
            >
              {contact.primaryCtaText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

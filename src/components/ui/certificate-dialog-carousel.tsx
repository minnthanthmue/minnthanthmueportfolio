import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  X,
  ArrowUpRight,
  Copy,
  Check,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { CertificateEntry } from '@/data/content';
import { cn } from '@/lib/utils';

export interface CertificateDialogCarouselProps {
  certificates: CertificateEntry[];
  className?: string;
}

interface CertificateCardProps {
  cert: CertificateEntry;
  index: number;
  isFeatured: boolean;
  onOpenDialog: (cert: CertificateEntry, triggerElement: HTMLElement | null) => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
  cert,
  index,
  isFeatured,
  onOpenDialog,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [logoError, setLogoError] = useState(false);
  const [watermarkError, setWatermarkError] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Detect touch device to disable pointer spotlight
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  const issuerLogoSrc = cert.issuerLogo || cert.logo || '/assets/issuers/google.svg';
  const issueDate = cert.issueDate || cert.date || '2026';
  const visibleSkills = (cert.tags && cert.tags.length > 0)
    ? cert.tags.slice(0, 3)
    : ['Artificial Intelligence', 'Machine Learning', 'Prompt Engineering'];

  const indexLabel = String(index + 1).padStart(2, '0');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || shouldReduceMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  const handleClick = () => {
    onOpenDialog(cert, cardRef.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenDialog(cert, cardRef.current);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      tabIndex={0}
      role="button"
      aria-label={`View ${cert.title} credential details`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.35,
        delay: shouldReduceMotion ? 0 : index * 0.08,
        ease: 'easeOut',
      }}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden',
        'bg-[#FFFFFF] rounded-[24px] border border-[#E7E5E0] p-6',
        'cursor-pointer select-none outline-none',
        'transition-all duration-300 ease-out',
        // Hover interactions: lift 4px, soft shadow, border moves toward accent
        !shouldReduceMotion && 'hover:-translate-y-1 hover:border-[#2F4BFF]/50 hover:shadow-[0_12px_32px_rgba(17,17,17,0.08)]',
        // Accessible focus ring
        'focus-visible:ring-2 focus-visible:ring-[#2F4BFF] focus-visible:ring-offset-2',
        // Bento layout column span
        isFeatured ? 'col-span-1 md:col-span-2' : 'col-span-1'
      )}
    >
      {/* 2px accent line (#2F4BFF) along the top edge that grows from 0 to full width on hover */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-0 left-0 h-[2px] bg-[#2F4BFF] pointer-events-none transition-all duration-300 ease-out z-20',
          shouldReduceMotion ? 'w-full opacity-0 group-hover:opacity-100' : 'w-0 group-hover:w-full group-focus-visible:w-full'
        )}
      />

      {/* Subtle cursor spotlight (radial glow of accent at ~8% opacity) - disabled on touch and reduced-motion */}
      {!isTouchDevice && !shouldReduceMotion && mousePos && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-200"
          style={{
            background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(47, 75, 255, 0.08), transparent 70%)`,
          }}
        />
      )}

      {/* Oversized issuer logo as a faded watermark in the top-right corner (~120px, 6-8% opacity, slightly cropped) */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none select-none absolute -right-4 -top-4 w-[124px] h-[124px] z-0 overflow-hidden',
          'transition-transform duration-300 ease-out',
          !shouldReduceMotion && 'group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1'
        )}
      >
        {!watermarkError && issuerLogoSrc ? (
          <img
            src={issuerLogoSrc}
            alt=""
            className="w-full h-full object-contain opacity-[0.07] grayscale contrast-125"
            onError={() => setWatermarkError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-bold text-[88px] text-[#111111] opacity-[0.05]">
            {cert.issuer.charAt(0)}
          </div>
        )}
      </div>

      {/* Content wrapper relative to sit above watermark */}
      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        {/* Top Row: Small issuer logo in 40px rounded square & mono index label */}
        <div className="flex items-center justify-between gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-white border border-[#E7E5E0] p-1.5 flex items-center justify-center shrink-0 shadow-sm">
            {!logoError && issuerLogoSrc ? (
              <img
                src={issuerLogoSrc}
                alt={`${cert.issuer} logo`}
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              // Monogram fallback: first letter of the issuer on a #F7F7F5 circle
              <div
                className="w-7 h-7 rounded-full bg-[#F7F7F5] flex items-center justify-center font-mono font-bold text-xs text-[#111111]"
                aria-hidden="true"
              >
                {cert.issuer.charAt(0)}
              </div>
            )}
          </div>

          <span className="font-mono text-xs font-medium text-[#9A9A93] tracking-widest select-none">
            {indexLabel}
          </span>
        </div>

        {/* Middle: Certificate Title & "Issuer · Mon YYYY" */}
        <div className="space-y-1.5 my-auto">
          <h3
            className={cn(
              'font-semibold text-[#111111] line-clamp-2 tracking-tight transition-colors duration-200 group-hover:text-[#2F4BFF]',
              isFeatured ? 'text-[20px] sm:text-[22px] leading-tight' : 'text-[18px] sm:text-[19px] leading-snug'
            )}
          >
            {cert.title}
          </h3>
          <p className="text-xs sm:text-[13px] font-normal text-[#5C5C57]">
            {cert.issuer} &middot; {issueDate}
          </p>
        </div>

        {/* Bottom: Up to 3 skill pills & Circular arrow button at right */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {/* Skill pills (#F7F7F5 background, 12px text) */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
            {visibleSkills.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium text-[#5C5C57] bg-[#F7F7F5] border border-[#E7E5E0]/60 whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Circular arrow button (36px, 1px border) at right */}
          <div
            className={cn(
              'w-9 h-9 rounded-full border border-[#E7E5E0] bg-white flex items-center justify-center shrink-0',
              'text-[#111111] transition-all duration-300 ease-out shadow-sm',
              'group-hover:bg-[#111111] group-hover:border-[#111111] group-hover:text-white',
              'group-focus-visible:bg-[#111111] group-focus-visible:border-[#111111] group-focus-visible:text-white'
            )}
            aria-hidden="true"
          >
            <ArrowUpRight
              className={cn(
                'w-4 h-4 transition-transform duration-300 ease-out',
                !shouldReduceMotion && 'group-hover:rotate-45 group-focus-visible:rotate-45'
              )}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const CertificateDialogCarousel: React.FC<CertificateDialogCarouselProps> = ({
  certificates,
  className,
}) => {
  const [selectedCert, setSelectedCert] = useState<CertificateEntry | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [modalImageError, setModalImageError] = useState(false);
  const [modalLogoError, setModalLogoError] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const copyTimeoutRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleOpenDialog = useCallback((cert: CertificateEntry, triggerElement: HTMLElement | null) => {
    triggerRef.current = triggerElement;
    setSelectedCert(cert);
    setCopiedId(false);
    setModalImageError(false);
    setModalLogoError(false);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSelectedCert(null);
    if (copyTimeoutRef.current) {
      window.clearTimeout(copyTimeoutRef.current);
    }
    // Return focus to the trigger element for accessibility
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 50);
  }, []);

  // Body scroll locking while dialog is open
  useEffect(() => {
    if (selectedCert) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedCert]);

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCert) {
        handleCloseDialog();
      }
    };
    if (selectedCert) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCert, handleCloseDialog]);

  const handleCopyCredential = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedId(true);
    if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = window.setTimeout(() => setCopiedId(false), 2000);
  };

  if (!certificates || certificates.length === 0) {
    return null;
  }

  const certImageSrc = selectedCert?.image || '/assets/certificates/google-ai.svg';
  const certLogoSrc = selectedCert ? (selectedCert.issuerLogo || selectedCert.logo || '/assets/issuers/google.svg') : '';
  const credentialId = selectedCert?.credentialId || '545Z2IG6REOZ';
  const verifyUrl = selectedCert?.credentialUrl || selectedCert?.url || 'https://coursera.org/verify/professional-cert/545Z2IG6REOZ';
  const displayDate = selectedCert?.issueDate || selectedCert?.date || '2026';

  return (
    <div className={cn('w-full', className)}>
      {/* Bento Grid: Desktop 3 cols, Tablet 2 cols, Mobile 1 col. Gap 16px (gap-4). First card featured spanning 2 cols */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {certificates.map((cert, index) => {
          const isFeatured = index === 0;
          return (
            <CertificateCard
              key={cert.id || index}
              cert={cert}
              index={index}
              isFeatured={isFeatured}
              onOpenDialog={handleOpenDialog}
            />
          );
        })}
      </div>

      {/* Shared-element dialog morph modal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedCert && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
                style={{ backdropFilter: 'blur(6px)' }}
              >
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                  onClick={handleCloseDialog}
                  className="fixed inset-0 bg-black/50"
                  aria-hidden="true"
                />

                {/* Dialog Content Container */}
                <motion.div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="cert-dialog-title"
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.95, y: 16 }
                  }
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, scale: 1, y: 0 }
                  }
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.95, y: 16 }
                  }
                  transition={{
                    type: 'spring',
                    damping: 28,
                    stiffness: 300,
                    duration: shouldReduceMotion ? 0 : 0.25,
                  }}
                  className={cn(
                    'relative z-10 w-full max-w-2xl overflow-hidden',
                    'bg-[#FFFFFF] rounded-[24px] border border-[#E7E5E0] shadow-2xl',
                    'my-auto p-6 sm:p-8 max-h-[90vh] overflow-y-auto'
                  )}
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#2F4BFF]" />

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={handleCloseDialog}
                    className={cn(
                      'absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F7F7F5] border border-[#E7E5E0]',
                      'flex items-center justify-center text-[#5C5C57] hover:text-[#111111] hover:bg-white',
                      'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4BFF]'
                    )}
                    aria-label="Close certificate dialog"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-6">
                    {/* Header: Issuer Logo & Name + Date */}
                    <div className="flex items-center gap-3.5 pr-8">
                      <div className="w-10 h-10 rounded-[12px] bg-white border border-[#E7E5E0] p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                        {!modalLogoError && certLogoSrc ? (
                          <img
                            src={certLogoSrc}
                            alt={`${selectedCert.issuer} logo`}
                            className="w-full h-full object-contain"
                            onError={() => setModalLogoError(true)}
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#F7F7F5] flex items-center justify-center font-mono font-bold text-xs text-[#111111]">
                            {selectedCert.issuer.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                          {selectedCert.issuer}
                        </div>
                        <div className="text-xs text-[#5C5C57]">
                          Issued: {displayDate}
                        </div>
                      </div>
                    </div>

                    {/* Certificate Title */}
                    <div>
                      <h2
                        id="cert-dialog-title"
                        className="text-xl sm:text-2xl font-semibold text-[#111111] tracking-tight"
                      >
                        {selectedCert.title}
                      </h2>
                    </div>

                    {/* Large Certificate Image Preview */}
                    <div className="w-full rounded-2xl overflow-hidden border border-[#E7E5E0] bg-[#F7F7F5] shadow-inner">
                      {!modalImageError && certImageSrc ? (
                        <img
                          src={certImageSrc}
                          alt={`${selectedCert.title} credential view`}
                          className="w-full h-auto max-h-[340px] object-contain mx-auto"
                          onError={() => setModalImageError(true)}
                        />
                      ) : (
                        <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3">
                          <Award className="w-12 h-12 text-[#2F4BFF]" />
                          <div className="font-semibold text-[#111111] text-base">
                            {selectedCert.title}
                          </div>
                          <div className="text-xs text-[#5C5C57]">
                            {selectedCert.issuer} &middot; Verified Credential
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Credential ID row with Copy action */}
                    {credentialId && (
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F7F7F5] border border-[#E7E5E0]">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#2F4BFF]" />
                          <span className="font-mono text-xs text-[#5C5C57]">CREDENTIAL ID:</span>
                          <span className="font-mono text-xs font-semibold text-[#111111] select-all">
                            {credentialId}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleCopyCredential(e, credentialId)}
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium',
                            'border border-[#E7E5E0] bg-white transition-colors duration-150',
                            copiedId ? 'text-emerald-600 border-emerald-300' : 'text-[#111111] hover:bg-[#F7F7F5]'
                          )}
                          aria-label="Copy credential ID"
                        >
                          {copiedId ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#5C5C57]" />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Description */}
                    {selectedCert.description && (
                      <div className="text-xs sm:text-sm text-[#5C5C57] leading-relaxed">
                        {selectedCert.description}
                      </div>
                    )}

                    {/* Tags / Skills */}
                    {selectedCert.tags && selectedCert.tags.length > 0 && (
                      <div className="space-y-2">
                        <div className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#5C5C57]">
                          Skills &amp; Topics
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCert.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-[#5C5C57] bg-[#F7F7F5] border border-[#E7E5E0]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Actions: Verify Credential Button */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#E7E5E0]">
                      <a
                        href={verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full',
                          'bg-[#111111] text-white text-xs sm:text-sm font-medium',
                          'hover:bg-[#2F4BFF] transition-colors duration-200',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4BFF] focus-visible:ring-offset-2'
                        )}
                      >
                        <span>Verify credential</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

export default CertificateDialogCarousel;

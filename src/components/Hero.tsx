import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TextScramble } from '@/components/ui/text-scramble';
import { Camera } from 'lucide-react';

export const Hero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CANDIDATES = [
    '/assets/profile.png',
    '/assets/profile.jpg',
    '/assets/profile.webp',
    '/images/profile.png',
    '/images/profile.jpg',
  ];

  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize from localStorage if previously uploaded/selected
  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio_profile_photo');
      if (saved) {
        setCustomPhoto(saved);
        setImgLoaded(true);
        setImgFailed(false);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleImgError = () => {
    if (customPhoto) {
      // If custom photo failed, fall back to candidate files
      setCustomPhoto(null);
      setCandidateIndex(0);
      setImgLoaded(false);
      return;
    }

    if (candidateIndex < CANDIDATES.length - 1) {
      setCandidateIndex((prev) => prev + 1);
    } else {
      setImgFailed(true);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setCustomPhoto(dataUrl);
        setImgLoaded(true);
        setImgFailed(false);
        try {
          localStorage.setItem('portfolio_profile_photo', dataUrl);
        } catch {
          // Ignore storage quota
        }
      }
    };
    reader.readAsDataURL(file);

    // Also persist directly to disk on dev server via /api/upload
    fetch('/api/upload?type=profile', {
      method: 'POST',
      body: file,
    }).catch(() => {
      // Dev server upload fallback
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const currentSrc = customPhoto || CANDIDATES[candidateIndex];

  return (
    <section
      id="top"
      className="relative scroll-mt-24 min-h-[100svh] flex flex-col justify-center items-center text-center px-4 select-text"
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease: 'easeOut' }}
        className="w-full max-w-[640px] mx-auto flex flex-col items-center text-center space-y-6"
      >
        {/* Profile photo circle (96px, 1px border #E7E5E0, #F7F7F5 placeholder with "MTH") above the name */}
        <div className="select-none relative group">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            aria-label="Upload profile photo"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            title="Click or drag & drop to update profile photo"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click();
              }
            }}
            className={`relative w-24 h-24 rounded-full bg-[#F7F7F5] border border-[#E7E5E0] overflow-hidden cursor-pointer transition-transform duration-150 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#2F4BFF] focus-visible:ring-offset-2 ${
              isDragging ? 'ring-2 ring-[#2F4BFF] ring-offset-2 scale-105' : ''
            }`}
          >
            {!imgFailed ? (
              <img
                key={currentSrc}
                src={currentSrc}
                alt="Portrait of Minn Thant Hmue"
                width={96}
                height={96}
                loading="eager"
                onError={handleImgError}
                onLoad={() => {
                  setImgLoaded(true);
                  setImgFailed(false);
                }}
                className={`w-full h-full object-cover object-top rounded-full transition-opacity duration-200 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : null}

            {/* Placeholder (#F7F7F5) with initials "MTH" until profile photo is added */}
            {(!imgLoaded || imgFailed) && (
              <div className="absolute inset-0 rounded-full bg-[#F7F7F5] flex items-center justify-center select-none text-[#111111] font-mono text-xl font-medium tracking-wider">
                MTH
              </div>
            )}

            {/* Subtle camera hover indicator for easy photo selection */}
            <div className="absolute inset-0 rounded-full bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white">
              <Camera size={18} strokeWidth={2} />
              <span className="text-[10px] font-medium tracking-wide mt-1">Photo</span>
            </div>
          </div>
        </div>

        {/* 1. Name as h1: strictly on one single line with whitespace-nowrap */}
        <h1 className="hero-name-heading text-[#111111] font-semibold tracking-[-0.03em] leading-[1.05] select-none text-center w-full">
          <TextScramble
            text="Minn Thant Hmue"
            as="span"
            align="center"
            className="text-[clamp(1.75rem,7.5vw,4.75rem)] font-semibold text-[#111111] tracking-[-0.03em] block cursor-default whitespace-nowrap"
          />
        </h1>

        {/* 2. One line below: clamp(1rem, 3.5vw, 1.25rem), #5C5C57 */}
        <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#5C5C57] font-normal leading-relaxed max-w-[560px]">
          Digital Business and Innovation Student at Tokyo International University.
        </p>

        {/* 3. One primary button: "View projects" (solid #111111, white text, pill). Hover: slight lift */}
        <div className="pt-2">
          <a
            href="#projects"
            className="inline-flex items-center justify-center h-11 px-7 rounded-full bg-[#111111] text-white text-sm font-medium hover:-translate-y-[2px] active:translate-y-0 transition-all duration-150 outline-none focus-visible:outline-2 focus-visible:outline-[#2F4BFF] focus-visible:outline-offset-2 motion-reduce:transform-none select-none cursor-pointer"
          >
            View projects
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

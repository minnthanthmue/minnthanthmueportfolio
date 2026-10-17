'use client'

/**
 * @author: @emerald-ui
 * @description: Editorial-style team member card with overlapping layers and motion
 * @version: 2.0.0
 * @date: 2026-02-19
 * @license: MIT
 * @website: https://emerald-ui.com
 *
 */
import React from 'react'
import { ArrowRight, Github, Linkedin, Instagram } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export interface TeamMemberCardProps {
  position?: 'left' | 'right'
  jobPosition?: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  description?: string
  className?: string
  githubUrl?: string
  linkedinUrl?: string
  instagramUrl?: string
  ctaHref?: string
  onCtaClick?: () => void
}

/**
 * Editorial-style team member card with overlapping portrait, large display
 * typography, circular CTA toggle, and staggered entrance animations.
 */
export default function TeamMemberCard({
  position = 'left',
  jobPosition = 'Digital Business and Innovation Student',
  firstName = 'Minn Thant',
  lastName = 'Hmue',
  imageUrl = '/images/profile.png',
  description = 'Digital Business & Innovation undergraduate at Tokyo International University. I build fast, reliable web interfaces, machine learning models, and automated AI pipelines.',
  className,
  githubUrl,
  linkedinUrl,
  instagramUrl,
  ctaHref = '#contact',
  onCtaClick,
}: TeamMemberCardProps) {
  const fullName = `${firstName} ${lastName}`
  const isPositionRight = position === 'right'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn('relative my-6 lg:my-12 flex flex-col justify-center w-full max-w-[820px] mx-auto', className)}
    >
      {/* jobPosition label — editorial uppercase tracking with orange accent */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p
          className={cn(
            'mb-4 text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-orange-600 dark:text-orange-400 uppercase select-none',
            isPositionRight && 'text-right'
          )}
        >
          {jobPosition}
        </p>
      </motion.div>

      {/* Main card body with responsive stacking on mobile and editorial overlap on desktop */}
      <div className={cn(
        'flex flex-col md:flex-row items-center justify-center md:justify-end gap-6 md:gap-0',
        isPositionRight && 'md:flex-row-reverse'
      )}>
        {/* Portrait image with frosted glass bezel and reveal animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'relative h-[340px] sm:h-[420px] md:h-[480px] w-full max-w-[280px] sm:max-w-[320px] md:w-[350px] shrink-0 overflow-hidden rounded-[2rem] bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/80 dark:border-white/20 shadow-[0_20px_45px_-10px_rgba(11,16,32,0.1),inset_0_1px_1.5px_rgba(255,255,255,0.95)]',
            isPositionRight && 'md:order-1'
          )}
        >
          {/* Subtle grain/gradient overlay for texture */}
          <div className='pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/25 via-transparent to-transparent' />
          
          {/* Ambient orange glow inside frame */}
          <div className='pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-orange-500/15 blur-2xl z-10' />

          <img
            src={imageUrl}
            alt={fullName}
            className='h-full w-full object-cover transition-transform duration-500 ease-[0.22,1,0.36,1] hover:scale-105'
          />
        </motion.div>

        {/* Info block — overlaps image via negative margin on md+ screens */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'relative z-20 flex w-full md:w-[calc(100%-300px)] flex-col gap-6 sm:gap-8 md:gap-10 p-6 sm:p-8 rounded-[1.75rem] bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl border border-white/85 dark:border-white/20 shadow-[0_15px_35px_-5px_rgba(11,16,32,0.06),inset_0_1px_1.5px_rgba(255,255,255,0.95)]',
            isPositionRight ? 'md:right-8 md:items-end' : 'md:-left-10'
          )}
        >
          {/* Display name — large editorial type in vibrant orange */}
          <div>
            <h2 className='text-3xl sm:text-4xl md:text-5xl leading-[1.08] font-light tracking-tight text-orange-600 dark:text-orange-500'>
              {firstName}
              <br />
              <span className='font-bold text-orange-600 dark:text-orange-400'>{lastName}</span>
            </h2>
          </div>

          {/* Details row — CTA toggle + bio */}
          <div className={cn('flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-7', isPositionRight && 'md:justify-end')}>
            {/* Circular CTA with hover pulse & glass styling */}
            <motion.a
              href={ctaHref}
              onClick={onCtaClick}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Connect with ${fullName}`}
              className={cn(
                'group flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 via-orange-600 to-amber-500 border border-white/40 shadow-[0_8px_20px_rgba(234,88,12,0.35),inset_0_1px_1px_rgba(255,255,255,0.8)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_28px_rgba(234,88,12,0.5)]',
                isPositionRight && 'md:order-1'
              )}
            >
              <ArrowRight
                size={22}
                className={cn(
                  'text-white transition-all duration-300 group-hover:-rotate-45',
                  isPositionRight && 'rotate-180 group-hover:rotate-225'
                )}
              />
            </motion.a>

            {/* Bio copy — restrained body text */}
            <div className='w-full sm:w-[70%]'>
              <p
                className={cn(
                  'text-sm leading-[1.8] text-[var(--ink-2)] font-normal',
                  isPositionRight && 'md:text-right'
                )}
              >
                {description}
              </p>

              {/* Social links row: GitHub, LinkedIn, Instagram */}
              {(githubUrl || linkedinUrl || instagramUrl) && (
                <div className={cn(
                  'mt-4 flex flex-wrap items-center gap-2',
                  isPositionRight && 'md:justify-end'
                )}>
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${fullName}'s GitHub`}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/80 dark:border-white/20 flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-2)] hover:bg-white hover:text-black hover:border-black/25 transition-all shadow-sm"
                    >
                      <Github size={14} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {linkedinUrl && (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${fullName}'s LinkedIn`}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/80 dark:border-white/20 flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-2)] hover:bg-white hover:text-[#0A66C2] hover:border-[#0A66C2]/35 transition-all shadow-sm"
                    >
                      <Linkedin size={14} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${fullName}'s Instagram`}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/80 dark:border-white/20 flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-2)] hover:bg-white hover:text-[#E4405F] hover:border-[#E4405F]/40 transition-all shadow-sm"
                    >
                      <Instagram size={14} />
                      <span>Instagram</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

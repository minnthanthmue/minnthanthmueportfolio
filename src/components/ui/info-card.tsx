"use client"

import React from "react"
import { MessageCircle, Github, Linkedin, Instagram } from "lucide-react"
import { cn } from "@/lib/utils"

export type ProfileCardProps = {
  name: string
  role: string
  status: "online" | "offline" | "away"
  avatar: string
  tags?: string[]
  isVerified?: boolean
  followers?: number
  githubUrl?: string
  linkedinUrl?: string
  instagramUrl?: string
  onMessage?: () => void
  className?: string
}

export default function AnimatedProfileCard({ profile }: { profile?: ProfileCardProps }) {
  const defaultProfile: ProfileCardProps = profile || {
    name: "Minn Thant Hmue",
    role: "Digital Business and Innovation Student",
    status: "online",
    avatar: "/images/profile.png",
    isVerified: true,
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    instagramUrl: "https://instagram.com",
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center w-full justify-center p-4 relative overflow-hidden">
      <ProfileCard {...defaultProfile} />
    </div>
  )
}

export function ProfileCard({
  name,
  role,
  status = "online",
  avatar,
  tags = [],
  isVerified,
  followers,
  githubUrl,
  linkedinUrl,
  instagramUrl,
  onMessage,
  className,
}: ProfileCardProps) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="relative group w-full max-w-[340px] sm:max-w-[360px]">
      {/* Subtle ambient orange/peach glassmorphic glow behind card */}
      <div
        aria-hidden="true"
        className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-orange-500/20 via-amber-400/15 to-transparent blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />

      <div
        className={cn(
          "relative overflow-hidden rounded-[1.75rem] bg-white/65 dark:bg-slate-900/40 backdrop-blur-2xl p-6 sm:p-7 w-full border border-white/85 dark:border-white/15 shadow-[0_20px_45px_-10px_rgba(11,16,32,0.08),inset_0_1px_1.5px_rgba(255,255,255,0.95)] transition-all duration-300 group-hover:shadow-[0_25px_55px_-8px_rgba(234,88,12,0.18),inset_0_1px_2px_rgba(255,255,255,1)] group-hover:-translate-y-1.5",
          className
        )}
      >
        {/* Subtle glass reflection highlight across the top-right corner */}
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br from-white/60 to-transparent blur-lg pointer-events-none"
        />

        {/* Profile Photo with frosted glass bezel and glowing ring */}
        <div className="mb-4 flex justify-center relative z-10">
          <div className="relative">
            <div className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full bg-white/70 dark:bg-slate-800/60 p-1.5 backdrop-blur-md border border-white/90 dark:border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
              {!imgError ? (
                <img
                  src={avatar}
                  alt={name}
                  onError={() => setImgError(true)}
                  className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-orange-100/80 text-orange-600 font-bold text-3xl flex items-center justify-center select-none">
                  {name.charAt(0)}
                </div>
              )}
            </div>

            {/* Glowing active indicator dot on the avatar */}
            <span
              className="absolute bottom-1 right-2 flex h-4 w-4"
              title="Online / Available"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-sm"></span>
            </span>

            {/* Glowing ring on hover */}
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="text-center relative z-10">
          {/* Name in orange heading color */}
          <h3 className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400 tracking-tight transition-colors duration-200">
            {name}
          </h3>

          {/* Role badge in frosted orange glass design */}
          <div className="mt-2.5 flex justify-center">
            <span className="inline-flex items-center rounded-full bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 dark:border-orange-500/40 px-3.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-300 shadow-[0_1px_2px_rgba(234,88,12,0.05),inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-sm transition-all duration-200 group-hover:border-orange-500/50">
              {role}
            </span>
          </div>

          {followers && (
            <p className="mt-2 text-xs text-[var(--ink-3)] font-medium">
              {followers.toLocaleString()} followers
            </p>
          )}
        </div>

        {/* Action Buttons: GitHub, LinkedIn, Instagram in frosted glassmorphism pills (min-h-[44px] tap target) */}
        <div className="mt-6 grid grid-cols-3 gap-2 relative z-10">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name}'s GitHub profile`}
              className="min-h-[44px] rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/80 dark:border-white/20 px-2 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--ink-2)] shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all duration-200 hover:shadow-[0_4px_14px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,1)] hover:bg-white hover:text-black hover:border-black/25 hover:-translate-y-0.5 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Github className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="truncate">GitHub</span>
            </a>
          )}

          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name}'s LinkedIn profile`}
              className="min-h-[44px] rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/80 dark:border-white/20 px-2 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--ink-2)] shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all duration-200 hover:shadow-[0_4px_14px_rgba(10,102,194,0.22),inset_0_1px_1px_rgba(255,255,255,1)] hover:bg-white hover:text-[#0A66C2] hover:border-[#0A66C2]/35 hover:-translate-y-0.5 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Linkedin className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="truncate">LinkedIn</span>
            </a>
          )}

          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name}'s Instagram profile`}
              className="min-h-[44px] rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/80 dark:border-white/20 px-2 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--ink-2)] shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all duration-200 hover:shadow-[0_4px_14px_rgba(228,64,95,0.25),inset_0_1px_1px_rgba(255,255,255,1)] hover:bg-white hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:-translate-y-0.5 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Instagram className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="truncate">Instagram</span>
            </a>
          )}
        </div>

        {onMessage && (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={onMessage}
              aria-label={`Send message to ${name}`}
              className="w-full min-h-[44px] rounded-full bg-white/50 backdrop-blur-md border border-white/80 py-2 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-[var(--ink-2)] hover:text-orange-600 hover:bg-white transition-all shadow-sm cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Send Message</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

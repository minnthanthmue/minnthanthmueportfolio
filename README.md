# Minn Thant Hmue - Personal Portfolio

A minimalist, clean personal portfolio for Minn Thant Hmue, Digital Business & Innovation student at Tokyo International University.

Production URL: https://minnthanthmue.com

## Overview

This repository contains the source code for the personal portfolio website of Minn Thant Hmue. Built with React, TypeScript, and Vite, the site follows a minimalist design language: light-only theme (#FAFAF8 background, #111 text, #F3F3F0 surface, and #C2410C muted accent), one column layout, thin 1px dividers, mobile-first responsiveness, and semantic accessibility.

## Live Site

- Canonical Address: https://minnthanthmue.com
- Domain Aliases: www.minnthanthmue.com redirects to https://minnthanthmue.com

## Features

- Fast static single-page architecture built with Vite and React.
- Light theme only with curated color tokens.
- Icon-only floating navigation pill with active section tracking and hover tooltips.
- Hero name animation using the custom "Rise and Focus" effect.
- Word-by-word opacity scroll reveal effect on section headings and bio paragraphs.
- Categorized tools stack grid showcasing official SVG logos with grayscale-to-color hover states.
- Data-driven education timeline with custom progress line and specialization badges.
- Interactive certificates Glass Folder showcasing the Google AI Professional Certificate with direct Coursera verification.
- Accessible contact links and mailto button.
- Comprehensive search engine optimization (OpenGraph, Twitter Cards, Schema.org Person JSON-LD, sitemap.xml, and robots.txt).

## Sections & Keyboard Shortcuts

The site follows a 12-column grid layout with 1040px container max-width, two columns on desktop, generous whitespace spacing (96px mobile, 144px desktop), and no divider lines. Navigation supports instant numeric shortcuts:

1. **Home** (`#top`): Hand-drawn avatar, status indicator, name animation, live Tokyo time, and contact call to action. *(Shortcut: `1` or `t`)*
2. **About** (`#about`): `01  About` — Two narrative paragraphs on the backdrop explaining academic background and development philosophy. *(Shortcut: `2`)*
3. **Education** (`#education`): `02  Education` — Vertical timeline rail with small nodes and plain text rows, specialization badges, and interactive certificates Glass Folder with certificate photo and integrated "Verify certificate" button on the front panel. *(Shortcut: `3`)*
   > Note: The certificates folder needs `/public/images/google-ai-certificate.png` (recommended 1088x736, 1.48 aspect ratio, under 150KB). A resilient fallback is implemented so that if the file is missing, the sheet renders as a clean paper sheet with title and meta without showing any broken image.
4. **Stack** (`#stack`): `03  Stack` — Bento-style grid on desktop with flat tiles showcasing official SVG logos across 5 categories. *(Shortcut: `4`)*
5. **Projects** (`#projects`): `04  Projects` — Interactive frosted Glass Folder driven by the `projects.items` array in `src/data/content.ts`. When empty, it displays an intentional "Projects in progress" sheet with "Coming soon" status; when populated, files rise out with project links. *(Shortcut: `5`)*
6. **Experience** (`#experience`): `05  Experience` — Professional statement at lead size and contact trigger. *(Shortcut: `6`)*
7. **Contact** (`#contact`): `06  Contact` — Three glass boxes in a row on desktop (Email with copy button, GitHub, LinkedIn), plus Primary "Email me" button. *(Shortcut: `7`)*
8. **Footer**: Clean copyright and author attribution.

## Tech Stack

- React 19
- TypeScript (strict mode)
- Vite
- Tailwind CSS
- motion (hardware-accelerated animations)
- lucide-react (interface icons)
- class-variance-authority

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

1. Clone the repository:
   git clone [Your GitHub URL]
   cd portfolio

2. Install dependencies:
   npm install

3. Run the development server:
   npm run dev

4. Open http://localhost:3000 in your browser.

### Building for Production

To produce an optimized production build:

npm run build

To preview the production build locally:

npm run preview

## Project Structure

```
.
├── public/
│   ├── assets/
│   │   ├── fonts/           # Self-hosted WOFF2 font files
│   │   └── logos/           # Official SVG tool logos
│   ├── images/              # Avatar, certificate, and social share graphics
│   ├── CNAME                # GitHub Pages domain configuration
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx       # Pill button component (CVA)
│   │   │   ├── name-reveal.tsx  # Hero name "Rise and Focus" effect
│   │   │   └── reveal-text.tsx  # Scroll word-reveal text component
│   │   ├── AboutSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── EducationSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx           # Floating icon pill navigation
│   │   ├── Hero.tsx
│   │   ├── ToolsSection.tsx
│   │   └── WorkSection.tsx
│   ├── data/
│   │   └── content.ts           # Central content and site data configuration
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Editing Content

All editable content lives in one central file:
`src/data/content.ts`

To personalize your portfolio, update:
- Hero introduction and avatar path
- Bio paragraphs in the about section
- Tool logos in the stack section
- Education timeline entries and certificate details
- Contact information:
  - Replace `[Your email]` with your active email address
  - Replace `[Your GitHub URL]` with your GitHub profile URL
  - Replace `[Your LinkedIn URL]` with your LinkedIn profile URL

## Text Reveal Effect

The `RevealText` component (`src/components/ui/reveal-text.tsx`) implements a one-way scroll-driven word opacity interpolation:
- Words begin at 30% rest opacity and transition to 100% as the element scrolls into view.
- Word ranges are computed across an 80% reveal span with a 20% window.
- Once a block reaches full visibility, it latches to 100% and does not dim on scroll-up.
- Respects `prefers-reduced-motion` by displaying full opacity immediately without animation.

## Accessibility

- Semantic HTML structure (`<header>`, `<main>`, `<section>`, `<nav>`, `<ol>`, `<ul>`, `<footer>`).
- Single `<h1>` heading with clear document outline.
- All interactive links and buttons have visible 2px outlines on keyboard focus with 2px offset.
- Minimum 44px tap target sizes on mobile devices.
- Images include descriptive `alt` text.
- Screen readers are provided with full text labels while animated spans remain aria-hidden.
- WCAG AA contrast compliance across text and accent elements.

## Deployment to minnthanthmue.com

### Preferred Option: Vercel

1. Push your repository to GitHub.
2. Sign in to Vercel (https://vercel.com) and click "Add New..." -> "Project".
3. Select your repository. Vite will be detected automatically (Build Command: `npm run build`, Output Directory: `dist`).
4. Click "Deploy".
5. In your Vercel project settings, go to "Domains":
   - Add `minnthanthmue.com` as the primary domain.
   - Add `www.minnthanthmue.com` and configure it to redirect to `minnthanthmue.com`.
6. At your domain registrar (where you purchased minnthanthmue.com), add these DNS records:
   - Apex domain (`@`):
     - Type: `A`
     - Value: `76.76.21.21`
   - Subdomain (`www`):
     - Type: `CNAME`
     - Value: `cname.vercel-dns.com`
7. Wait for DNS propagation (typically 5 to 60 minutes). Vercel issues and renews an SSL certificate automatically.

### Option 2: Netlify

1. Connect your GitHub repository at Netlify (https://netlify.com).
2. Set Build command to `npm run build` and Publish directory to `dist`.
3. In "Domain Management", add `minnthanthmue.com`.
4. At your domain registrar, add:
   - Apex domain (`@`):
     - Type: `A`
     - Value: `75.2.60.5`
   - Subdomain (`www`):
     - Type: `CNAME`
     - Value: your-site-name.netlify.app
5. Netlify will provision an SSL certificate and redirect `www.minnthanthmue.com` to `https://minnthanthmue.com`.

### Option 3: GitHub Pages

1. A `CNAME` file containing `minnthanthmue.com` is already placed in the `public/` directory so it is copied to `dist/` on build.
2. In your GitHub repository, go to "Settings" -> "Pages".
3. Under "Build and deployment", choose "GitHub Actions" (or deploy from the `gh-pages` branch).
4. In "Custom domain", verify `minnthanthmue.com` is configured and check "Enforce HTTPS".
5. At your domain registrar, add four apex A records pointing to GitHub Pages servers:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
   And one CNAME record for `www` pointing to `[Your GitHub Username].github.io`.

## Credits

- Typography: Instrument Serif by Rodrigo Fuenzalida and Jordan Dahl; Inter by Rasmus Andersson.
- Icons: Lucide Icons (ISC License) and Simple Icons.
- Design and Architecture: Built specifically for Minn Thant Hmue.

## License

(c) 2026 Minn Thant Hmue. All rights reserved.

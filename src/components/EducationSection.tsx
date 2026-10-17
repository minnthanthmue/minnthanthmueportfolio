import React from 'react';
import { siteContent } from '@/data/content';
import { RevealText } from '@/components/ui/reveal-text';
import Timeline, { TimelineItem } from '@/components/ui/timeline-02';
import { CertificateDialogCarousel } from '@/components/ui/certificate-dialog-carousel';
import { AnimatedSection, AnimatedSectionItem } from '@/components/ui/animated-section';

export const EducationSection: React.FC = () => {
  const { education } = siteContent;

  const educationTimelineItems: TimelineItem[] = [
    {
      year: '2023',
      title: 'Finished GED',
      description:
        'Completed high school equivalency diploma (GED) establishing the academic foundation to pursue university degree studies.',
      badge: 'Completed',
    },
    {
      year: '2024',
      title: 'Enrolled at Tokyo International University',
      description:
        'Undergraduate student in Digital Business & Innovation (DBI) in Tokyo, Japan. Bridging technical software development with strategic product sense and AI pipelines.',
      badge: 'In Progress',
      link: 'https://www.tiu.ac.jp',
    },
    {
      year: '2028',
      title: 'Expected Graduation Year',
      description:
        'Expected completion of Bachelor of Science in Digital Business & Innovation, prepared to build production web platforms, AI pipelines, and data systems.',
      badge: 'Expected',
    },
  ];

  return (
    <section id="education" className="scroll-mt-24 py-[96px] lg:py-[144px]">
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left column (4 cols): Sticky mono label and heading on desktop */}
        <AnimatedSectionItem className="lg:col-span-4 lg:sticky lg:top-24 self-start">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-2)] mb-2 sm:mb-3 select-none">
            02 &nbsp;Education
          </div>
          <RevealText as="h2" className="section-heading">
            {education.heading}
          </RevealText>
          <p className="mt-3 text-xs sm:text-sm text-[var(--text-2)] font-normal leading-relaxed">
            Academic timeline, milestones, and degree progress at Tokyo International University.
          </p>
        </AnimatedSectionItem>

        {/* Right column (8 cols): Interactive Timeline & Credentials */}
        <AnimatedSectionItem className="lg:col-span-8 w-full space-y-8 sm:space-y-10">
          {/* Interactive Timeline Component (text-only with clean spacing) */}
          <div id="timeline" className="scroll-mt-28 w-full rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 sm:p-7 shadow-[0_2px_8px_rgba(17,17,17,0.03)]">
            <Timeline items={educationTimelineItems} />
          </div>

          {/* Specialization Badges */}
          {education.specializations && education.specializations.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-2)] mr-1 select-none">
                FOCUS:
              </span>
              {education.specializations.map((spec) => (
                <span
                  key={spec}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono text-[var(--text-2)] border border-[var(--border)] bg-white select-none"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}

          {/* Certificates & Verified Credentials */}
          {education.certificates && education.certificates.length > 0 && (
            <div id="certificates" className="scroll-mt-28 w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-2)] select-none">
                  Certificates &amp; Credentials
                </div>
                <div className="text-[11px] font-mono text-[var(--text-muted)] select-none">
                  {education.certificates.length} {education.certificates.length === 1 ? 'Credential' : 'Credentials'}
                </div>
              </div>
              <CertificateDialogCarousel certificates={education.certificates} />
            </div>
          )}
        </AnimatedSectionItem>
      </AnimatedSection>
    </section>
  );
};

export default EducationSection;

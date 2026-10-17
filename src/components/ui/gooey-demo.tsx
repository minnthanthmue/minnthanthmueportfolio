import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import useDetectBrowser from '@/hooks/use-detect-browser';
import useScreenSize from '@/hooks/use-screen-size';
import { Button } from '@/components/ui/button';
import GooeySvgFilter from '@/components/fancy/filter/gooey-svg-filter';

const TAB_CONTENT = [
  {
    title: 'Minn Thant Hmue',
    subtitle: 'Undergraduate Developer',
    files: [
      'Origin: Myanmar · Location: Tokyo, Japan',
      'Focus: Web interfaces, machine learning & AI workflows',
      'Local model pipelines via Ollama & n8n orchestrations',
      'Seeking engineering opportunities & internships',
    ],
  },
  {
    title: 'Tokyo Int’l Univ',
    subtitle: 'Higher Education · Class of 2028',
    files: [
      'Enrolled 2024 · Expected Graduation 2028',
      'English Track (E-Track) academic program',
      'Ikebukuro & Kawagoe campuses in Tokyo',
      'Collaborative international student community',
    ],
  },
  {
    title: 'Digital Business',
    subtitle: 'Major: Digital Business & Innovation',
    files: [
      'B.S. in Digital Business & Innovation (DBI)',
      'Bridging technical engineering with strategic product sense',
      'Automated background leverage vs marketing gimmicks',
      'Fast, reliable web apps and data analytics',
    ],
  },
];

export default function GooeyDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const [isGooeyEnabled, setIsGooeyEnabled] = useState(true);
  const screenSize = useScreenSize();
  const browserName = useDetectBrowser();
  const isSafari = browserName === 'Safari';

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-4 sm:p-6 text-xs sm:text-sm bg-[var(--bg-page)] text-[var(--ink)]">
      <GooeySvgFilter
        id="gooey-filter-demo"
        strength={screenSize.lessThan('md') ? 8 : 15}
      />

      <div className="w-full flex justify-between items-center mb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-[var(--ink-3)]">
          Interactive Highlight Tabs
        </span>
        <button
          type="button"
          onClick={() => setIsGooeyEnabled(!isGooeyEnabled)}
          className="text-xs font-mono px-3 py-1.5 rounded-full border border-[var(--border-light)] bg-[var(--surface)] hover:bg-[#EAEAE5] transition-colors cursor-pointer"
        >
          {isGooeyEnabled ? 'Disable filter' : 'Enable filter'}
        </button>
      </div>

      <div className="w-full relative mt-2">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ filter: isGooeyEnabled ? 'url(#gooey-filter-demo)' : 'none' }}
        >
          <div className="flex w-full">
            {TAB_CONTENT.map((_, index) => (
              <div key={index} className="relative flex-1 h-10 md:h-12 px-1">
                {activeTab === index && (
                  <motion.div
                    layoutId="active-tab-demo"
                    className="absolute inset-0 bg-[#EFEFEA] rounded-t-xl"
                    transition={{
                      type: 'spring',
                      bounce: 0.0,
                      duration: isSafari ? 0 : 0.35,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          {/* Content panel */}
          <div className="w-full min-h-[180px] sm:min-h-[200px] bg-[#EFEFEA] rounded-b-xl overflow-hidden" />
        </div>

        {/* Interactive text overlay, no filter */}
        <div className="relative z-10">
          <div className="flex w-full">
            {TAB_CONTENT.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className="flex-1 h-10 md:h-12 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--ink)] rounded-t-xl"
              >
                <span
                  className={`w-full h-full flex items-center justify-center font-medium text-xs sm:text-sm px-2 truncate ${
                    activeTab === index ? 'text-[var(--ink)] font-semibold' : 'text-[var(--ink-3)]'
                  }`}
                >
                  {tab.title}
                </span>
              </button>
            ))}
          </div>

          <div className="w-full min-h-[180px] sm:min-h-[200px] p-6 text-[var(--ink-2)]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeTab}
                initial={{
                  opacity: 0,
                  y: 20,
                  filter: 'blur(8px)',
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  filter: 'blur(8px)',
                }}
                transition={{
                  duration: 0.2,
                  ease: 'easeOut',
                }}
              >
                <div className="text-xs font-mono text-[#C2410C] uppercase mb-1">
                  {TAB_CONTENT[activeTab].subtitle}
                </div>
                <div className="space-y-2 mt-2">
                  <ul className="divide-y divide-[var(--border-light)]/60">
                    {TAB_CONTENT[activeTab].files.map((file) => (
                      <li
                        key={file}
                        className="pt-2 pb-1.5 text-[var(--ink)] text-xs sm:text-sm flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]/60" />
                        {file}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

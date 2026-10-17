import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

export const sectionContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export const sectionItemVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}

/**
 * AnimatedSection: wraps section inner grids to trigger a staggered entrance
 * as the section scrolls into view. Respects prefers-reduced-motion.
 */
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  amount = 0.15,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={sectionContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: '0px 0px -40px 0px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedSectionItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={sectionItemVariants} className={className}>
      {children}
    </motion.div>
  );
};

export default AnimatedSection;

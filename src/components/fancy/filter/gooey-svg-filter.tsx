import React from 'react';

export interface GooeySvgFilterProps {
  id?: string;
  strength?: number;
  className?: string;
}

/**
 * GooeySvgFilter provides an SVG blur + alpha contrast matrix filter
 * that creates the viscous fluid / liquid morphing effect when two elements
 * with matching background colors intersect or transition.
 */
export const GooeySvgFilter: React.FC<GooeySvgFilterProps> = ({
  id = 'gooey-filter',
  strength = 12,
  className = '',
}) => {
  return (
    <svg
      aria-hidden="true"
      className={`fixed pointer-events-none opacity-0 ${className}`}
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        left: -9999,
        top: -9999,
      }}
    >
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
};

export default GooeySvgFilter;

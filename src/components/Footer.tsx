import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="pt-8 pb-16 sm:pb-20 text-left border-t border-[var(--border)] mt-12">
      <p className="text-[0.8125rem] font-normal text-[var(--text-secondary)]">
        &copy; 2026{' '}
        <span className="font-semibold text-[var(--text-primary)]">
          Minn Thant Hmue
        </span>
        . All rights reserved.
      </p>
    </footer>
  );
};

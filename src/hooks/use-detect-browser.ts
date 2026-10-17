import { useState, useEffect } from 'react';

export type BrowserName = 'Safari' | 'Chrome' | 'Firefox' | 'Edge' | 'Opera' | 'Unknown';

/**
 * Detects the current user's browser for tailoring animations
 * (e.g., Safari has known SVG filter performance quirks with springs).
 */
export function useDetectBrowser(): BrowserName {
  const [browser, setBrowser] = useState<BrowserName>('Unknown');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent;

    if (ua.includes('Edg/')) {
      setBrowser('Edge');
    } else if (ua.includes('OPR/') || ua.includes('Opera/')) {
      setBrowser('Opera');
    } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
      setBrowser('Chrome');
    } else if (
      ua.includes('Safari/') &&
      !ua.includes('Chrome/') &&
      !ua.includes('Chromium') &&
      !ua.includes('Android')
    ) {
      setBrowser('Safari');
    } else if (ua.includes('Firefox/')) {
      setBrowser('Firefox');
    } else {
      setBrowser('Unknown');
    }
  }, []);

  return browser;
}

export default useDetectBrowser;

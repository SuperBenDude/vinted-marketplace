import { useEffect } from 'react';

export function useScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    const body = document.body;
    const html = document.documentElement;

    // Save original styles
    const originalBodyOverflow = body.style.overflow;
    const originalHtmlOverflow = html.style.overflow;

    // Simple overflow hidden approach (better for mobile)
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';

    // Prevent iOS rubber band scrolling
    const preventScroll = (e) => {
      if (e.target.closest('.vinted-settings-modal')) {
        return; // Allow scrolling inside modal
      }
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });

    // Cleanup function
    return () => {
      body.style.overflow = originalBodyOverflow;
      html.style.overflow = originalHtmlOverflow;

      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isLocked]);
}

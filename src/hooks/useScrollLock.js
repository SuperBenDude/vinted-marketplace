import { useEffect } from 'react';

export function useScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    const body = document.body;
    const html = document.documentElement;

    // Save original styles
    const originalBodyOverflow = body.style.overflow;
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyPosition = body.style.position;
    const originalBodyWidth = body.style.width;

    // Simple overflow hidden approach (better for mobile)
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    body.style.position = 'relative';
    body.style.width = '100%';

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
      body.style.position = originalBodyPosition;
      body.style.width = originalBodyWidth;

      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isLocked]);
}

import { useEffect } from 'react';

export function useScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    const body = document.body;
    const html = document.documentElement;

    // Save original styles
    const originalBodyOverflow = body.style.overflow;
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyHeight = body.style.height;

    // Apply scroll lock with height lock to prevent layout shift
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    body.style.height = '100%';

    // Prevent iOS rubber band scrolling
    const preventScroll = (e) => {
      // Allow scrolling inside modals
      if (e.target.closest('.vinted-settings-modal') ||
          e.target.closest('.vinted-cropper-modal')) {
        return;
      }
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });

    // Cleanup function
    return () => {
      body.style.overflow = originalBodyOverflow;
      html.style.overflow = originalHtmlOverflow;
      body.style.height = originalBodyHeight;
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isLocked]);
}

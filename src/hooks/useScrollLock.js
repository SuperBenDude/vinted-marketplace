import { useEffect } from 'react';

export function useScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    // Save current scroll position
    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;

    // iOS PWA fix: Lock body position to prevent viewport shift
    const originalPosition = body.style.position;
    const originalTop = body.style.top;
    const originalWidth = body.style.width;

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    // Prevent touch scrolling
    const preventScroll = (e) => {
      if (e.target.closest('.vinted-settings-modal') ||
          e.target.closest('.vinted-cropper-modal')) {
        return;
      }
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });

    // Cleanup
    return () => {
      body.style.position = originalPosition;
      body.style.top = originalTop;
      body.style.width = originalWidth;

      document.removeEventListener('touchmove', preventScroll);

      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
}

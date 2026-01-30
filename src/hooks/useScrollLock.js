import { useEffect } from 'react';

export function useScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    // Prevent any touch-based scrolling on the background
    const preventScroll = (e) => {
      // Allow scrolling inside modals
      if (e.target.closest('.vinted-settings-modal') ||
          e.target.closest('.vinted-cropper-modal')) {
        return;
      }
      e.preventDefault();
    };

    // Prevent wheel scrolling
    const preventWheel = (e) => {
      if (e.target.closest('.vinted-settings-modal') ||
          e.target.closest('.vinted-cropper-modal')) {
        return;
      }
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('wheel', preventWheel, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventWheel);
    };
  }, [isLocked]);
}

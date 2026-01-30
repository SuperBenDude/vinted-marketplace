import { useEffect, useRef } from 'react';

export function useScrollLock(isLocked) {
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    if (!isLocked) return;

    const body = document.body;
    const html = document.documentElement;

    // Save current scroll position
    scrollPositionRef.current = window.scrollY;

    // Save original styles
    const originalStyles = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
    };

    // iOS-compatible scroll lock using position: fixed
    // This prevents viewport shift when file picker/keyboard appears
    body.style.position = 'fixed';
    body.style.top = `-${scrollPositionRef.current}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';

    // Prevent iOS rubber band scrolling on background
    const preventScroll = (e) => {
      if (e.target.closest('.vinted-settings-modal') ||
          e.target.closest('.vinted-cropper-modal')) {
        return;
      }
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      body.style.position = originalStyles.bodyPosition;
      body.style.top = originalStyles.bodyTop;
      body.style.left = originalStyles.bodyLeft;
      body.style.right = originalStyles.bodyRight;
      body.style.width = originalStyles.bodyWidth;
      body.style.overflow = originalStyles.bodyOverflow;
      html.style.overflow = originalStyles.htmlOverflow;

      window.scrollTo(0, scrollPositionRef.current);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isLocked]);
}

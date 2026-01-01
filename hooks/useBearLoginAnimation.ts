import { useState, useCallback } from 'react';
import { BEAR_ASSETS } from '../assets/img/bear';

export const useBearLoginAnimation = () => {
  const [currentImage, setCurrentImage] = useState(BEAR_ASSETS.watch[0]);

  const handleEmailChange = useCallback((textLength: number) => {
    // Maps character count (up to 20) to the 21 watch frames
    const frameIndex = Math.min(textLength, 20);
    setCurrentImage(BEAR_ASSETS.watch[frameIndex]);
  }, []);

  const triggerHideEyes = useCallback((isHiding: boolean, isPeeking: boolean = false) => {
    if (isPeeking) {
      setCurrentImage(BEAR_ASSETS.peek[3]); // Fully peeking frame
    } else if (isHiding) {
      setCurrentImage(BEAR_ASSETS.hide[5]); // Fully hidden frame
    } else {
      setCurrentImage(BEAR_ASSETS.watch[0]); // Reset to neutral
    }
  }, []);

  return { currentImage, handleEmailChange, triggerHideEyes };
};
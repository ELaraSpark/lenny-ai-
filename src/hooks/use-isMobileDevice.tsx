
import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is a mobile device
 * based on user agent and other factors
 */
export function useIsMobileDevice() {
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      // Regular expression for common mobile devices
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      
      // Check if user agent matches mobile devices
      const isMobile = mobileRegex.test(navigator.userAgent);
      
      // Check screen size as an additional factor
      const isMobileScreenSize = window.innerWidth <= 768;
      
      setIsMobileDevice(isMobile || isMobileScreenSize);
    };

    // Initial check
    checkMobile();
    
    // Add resize listener for responsive checks
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobileDevice;
}

export const detectPlatform = (): 'web' | 'mobile' => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Check for mobile devices
  if (/android/i.test(userAgent)) {
    return 'mobile';
  }
  
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'mobile';
  }
  
  // Check for touch support and small screen
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  
  if (isTouchDevice && isSmallScreen) {
    return 'mobile';
  }
  
  return 'web';
};

export const isMobile = () => detectPlatform() === 'mobile';

export const getDeviceInfo = () => {
  return {
    platform: detectPlatform(),
    userAgent: navigator.userAgent,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    isTouchDevice: 'ontouchstart' in window,
  };
};


import { useState, useEffect, useCallback } from 'react';
import {
  isWeChat,
  isWeChatMiniProgram,
  getDeviceInfo,
  configureWeChatShare,
  wechatStorage,
  WeChatShareConfig,
} from '../utils/wechatUtils';

interface WeChatHookReturn {
  isWeChat: boolean;
  isMiniProgram: boolean;
  deviceInfo: ReturnType<typeof getDeviceInfo>;
  shareToWeChat: (config: WeChatShareConfig) => void;
  showToast: (message: string, duration?: number) => void;
  vibrate: (pattern?: number | number[]) => void;
  isOnline: boolean;
  batteryLevel: number | null;
  storage: {
    getItem: (key: string) => any;
    setItem: (key: string, value: any) => void;
    removeItem: (key: string) => void;
  };
}

export const useWeChat = (): WeChatHookReturn => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const deviceInfo = getDeviceInfo();

  useEffect(() => {
    // Monitor network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get battery information if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(battery.level);

        const updateBattery = () => setBatteryLevel(battery.level);
        battery.addEventListener('levelchange', updateBattery);

        return () => battery.removeEventListener('levelchange', updateBattery);
      });
    }

    // Apply WeChat-specific styles
    if (isWeChat()) {
      document.body.classList.add('wechat-env');
    }

    if (isWeChatMiniProgram()) {
      document.body.classList.add('wechat-miniprogram');
    }

    // Add mobile optimizations
    if (deviceInfo.isMobile) {
      document.body.classList.add('mobile-env');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [deviceInfo.isMobile]);

  const shareToWeChat = useCallback((config: WeChatShareConfig) => {
    if (isWeChat()) {
      configureWeChatShare(config);
    } else {
      // Fallback to Web Share API or custom share modal
      if (navigator.share) {
        navigator
          .share({
            title: config.title,
            text: config.desc,
            url: config.link,
          })
          .catch(console.error);
      } else {
        // Show custom share modal
        showToast('Please copy the link to share', 3000);
      }
    }
  }, []);

  const showToast = useCallback((message: string, duration: number = 2000) => {
    // For WeChat Mini Program, use native toast
    if (isWeChatMiniProgram() && (window as any).wx) {
      (window as any).wx.showToast({
        title: message,
        duration: duration,
        mask: true,
      });
      return;
    }

    // For web, use custom toast
    setToastMessage(message);
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
    }, duration);
  }, []);

  const vibrate = useCallback((pattern: number | number[] = 100) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    } else if (isWeChatMiniProgram() && (window as any).wx) {
      (window as any).wx.vibrateShort({
        type: 'medium',
      });
    }
  }, []);

  const storage = {
    getItem: (key: string) => wechatStorage.getItem(key),
    setItem: (key: string, value: any) => wechatStorage.setItem(key, value),
    removeItem: (key: string) => wechatStorage.removeItem(key),
  };

  // Create toast element if not exists
  useEffect(() => {
    if (toastVisible && !isWeChatMiniProgram()) {
      const existingToast = document.querySelector('.mobile-toast');
      if (existingToast) {
        existingToast.remove();
      }

      const toast = document.createElement('div');
      toast.className = 'mobile-toast show';
      toast.textContent = toastMessage;
      document.body.appendChild(toast);

      const timer = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [toastVisible, toastMessage]);

  return {
    isWeChat: isWeChat(),
    isMiniProgram: isWeChatMiniProgram(),
    deviceInfo,
    shareToWeChat,
    showToast,
    vibrate,
    isOnline,
    batteryLevel,
    storage,
  };
};

// Hook for handling mobile gestures
export const useMobileGestures = () => {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
    null
  );
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStart) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;

      // Check if horizontal swipe is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        setSwipeDirection(deltaX > 0 ? 'right' : 'left');

        // Reset after a short delay
        setTimeout(() => setSwipeDirection(null), 100);
      }

      setTouchStart(null);
    },
    [touchStart]
  );

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return { swipeDirection };
};

// Hook for managing app state in WeChat environment
export const useWeChatAppState = () => {
  const [appState, setAppState] = useState<
    'active' | 'background' | 'inactive'
  >('active');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait'
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAppState('background');
      } else {
        setAppState('active');
      }
    };

    const handleOrientationChange = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    // WeChat Mini Program specific events
    if (isWeChatMiniProgram() && (window as any).wx) {
      (window as any).wx.onAppShow(() => setAppState('active'));
      (window as any).wx.onAppHide(() => setAppState('background'));
    }

    // Initial orientation
    handleOrientationChange();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return { appState, orientation };
};

export default useWeChat;

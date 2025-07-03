/**
 * WeChat Mini App Utilities
 * Provides WeChat-specific functionality and optimizations
 */

// WeChat detection and utilities
export const isWeChat = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger');
};

export const isWeChatMiniProgram = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.includes('miniprogram');
};

// WeChat sharing configuration
export interface WeChatShareConfig {
  title: string;
  desc: string;
  link: string;
  imgUrl: string;
}

export const configureWeChatShare = (config: WeChatShareConfig): void => {
  if (!isWeChat()) return;

  // WeChat JS-SDK configuration would go here
  // This is a simplified version for demo purposes
  if ((window as any).wx) {
    (window as any).wx.config({
      // WeChat JS-SDK configuration
      debug: false,
      appId: process.env.REACT_APP_WECHAT_APP_ID || '',
      timestamp: Math.floor(Date.now() / 1000),
      nonceStr: Math.random().toString(36).substr(2, 15),
      signature: '', // This would be generated server-side
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
      ],
    });

    (window as any).wx.ready(() => {
      // Share to friends
      (window as any).wx.updateAppMessageShareData({
        title: config.title,
        desc: config.desc,
        link: config.link,
        imgUrl: config.imgUrl,
        success: () => console.log('WeChat share configured successfully'),
        cancel: () => console.log('WeChat share cancelled'),
      });

      // Share to timeline
      (window as any).wx.updateTimelineShareData({
        title: config.title,
        link: config.link,
        imgUrl: config.imgUrl,
        success: () =>
          console.log('WeChat timeline share configured successfully'),
        cancel: () => console.log('WeChat timeline share cancelled'),
      });
    });
  }
};

// Mobile touch utilities for WeChat
export const enableMobileOptimizations = (): void => {
  if (typeof window === 'undefined') return;

  // Prevent zoom on double tap
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    event => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );

  // Prevent pull-to-refresh on iOS
  document.addEventListener(
    'touchmove',
    event => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },
    { passive: false }
  );

  // Add mobile viewport meta tag if not present
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content =
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(viewport);
  }
};

// WeChat Mini App navigation
export const navigateInMiniProgram = (path: string): void => {
  if (isWeChatMiniProgram() && (window as any).wx) {
    (window as any).wx.miniProgram.navigateTo({
      url: path,
    });
  } else {
    window.location.href = path;
  }
};

// Device detection for WeChat
export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isMobile = /Mobi|Android/i.test(ua);

  return {
    isIOS,
    isAndroid,
    isMobile,
    isWeChat: isWeChat(),
    isMiniProgram: isWeChatMiniProgram(),
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    pixelRatio: window.devicePixelRatio || 1,
  };
};

// Performance optimization for WeChat
export const optimizeForWeChat = (): void => {
  // Preload critical resources
  const preloadLinks = [
    { rel: 'preload', as: 'style', href: '/static/css/wechat.css' },
    {
      rel: 'preload',
      as: 'font',
      href: '/static/fonts/wechat-icons.woff2',
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },
  ];

  preloadLinks.forEach(link => {
    const linkElement = document.createElement('link');
    Object.entries(link).forEach(([key, value]) => {
      linkElement.setAttribute(key, value);
    });
    document.head.appendChild(linkElement);
  });

  // Lazy load non-critical images
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || '';
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};

// WeChat payment integration (placeholder)
export const initWeChatPay = (config: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!isWeChat()) {
      reject(new Error('WeChat Pay only available in WeChat'));
      return;
    }

    if ((window as any).WeixinJSBridge) {
      (window as any).WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        config,
        (res: any) => {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            resolve(res);
          } else {
            reject(new Error(res.err_msg));
          }
        }
      );
    } else {
      reject(new Error('WeChat Pay not available'));
    }
  });
};

// Storage utilities for WeChat Mini Program
export const wechatStorage = {
  setItem: (key: string, value: any): void => {
    try {
      if (isWeChatMiniProgram() && (window as any).wx) {
        (window as any).wx.setStorageSync(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Failed to set storage:', error);
    }
  },

  getItem: (key: string): any => {
    try {
      if (isWeChatMiniProgram() && (window as any).wx) {
        return (window as any).wx.getStorageSync(key);
      } else {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
    } catch (error) {
      console.error('Failed to get storage:', error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    try {
      if (isWeChatMiniProgram() && (window as any).wx) {
        (window as any).wx.removeStorageSync(key);
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Failed to remove storage:', error);
    }
  },
};

// Network request optimization for WeChat
export const wechatRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Add WeChat-specific headers
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': navigator.userAgent,
    ...options.headers,
  };

  // Add timeout for WeChat environment
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Image compression for WeChat sharing
export const compressImageForWeChat = (
  file: File,
  maxSize: number = 500
): Promise<File> => {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      const maxDimension = Math.max(width, height);

      if (maxDimension > maxSize) {
        const ratio = maxSize / maxDimension;
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        0.8
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

export default {
  isWeChat,
  isWeChatMiniProgram,
  configureWeChatShare,
  enableMobileOptimizations,
  navigateInMiniProgram,
  getDeviceInfo,
  optimizeForWeChat,
  initWeChatPay,
  wechatStorage,
  wechatRequest,
  compressImageForWeChat,
};

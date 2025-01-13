'use client';

import { useEffect } from 'react';

const isKakaoWebView = () => {
  if (typeof window === "undefined") return false;
  return /KAKAOTALK/i.test(window.navigator.userAgent);
};

export default function KakaoWebViewRedirect() {
  useEffect(() => {
    if (isKakaoWebView()) {
      const currentUrl = window.location.href;
      const userAgent = window.navigator.userAgent.toLowerCase();
      
      if (userAgent.includes('android')) {
        window.location.href = 'kakaotalk://inappbrowser/close';
        setTimeout(() => {
          window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
        }, 100);
      } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        window.location.href = 'kakaoweb://closeBrowser';
        setTimeout(() => {
          window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
        }, 100);
      }
    }
  }, []);

  return null;
}

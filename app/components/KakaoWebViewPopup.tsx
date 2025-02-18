'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const COOKIE_NAME = 'kakao-webview-popup-closed';

const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

export const KakaoWebViewPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isKakaoWebView = /kakaotalk/i.test(userAgent);
    const isAndroid = userAgent.includes('android');
    const hasSeenPopup = getCookie(COOKIE_NAME);

    if ((isKakaoWebView || isAndroid) && !hasSeenPopup) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setCookie(COOKIE_NAME, 'true', 365);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-[80%] max-w-md bg-white rounded-lg p-4">
        <div className="text-center text-2xl font-bold text-gray-600 my-2">
          카카오톡 웹뷰 공지
        </div>

        <Image
          src="/notice.png"
          alt="카카오톡 브라우저로 열기 안내"
          width={500}
          height={300}
          className="w-full h-auto border border-gray-200 rounded-lg"
        />
        <div className="text-center mt-2">
          로그인 서비스 이용 시{' '}
          <span className="text-red-500 font-bold">다른 브라우저로 열기</span>{' '}
          를 선택해주세요.
        </div>
        <button
          onClick={handleClose}
          className="w-full mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

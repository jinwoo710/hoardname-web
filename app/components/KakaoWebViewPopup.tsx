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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-xl bg-card p-4 text-card-foreground">
        <div className="my-2 text-center text-xl font-bold">
          카카오톡 웹뷰 공지
        </div>

        <Image
          src="/notice.png"
          alt="카카오톡 브라우저로 열기 안내"
          width={500}
          height={300}
          className="h-auto w-full rounded-lg border"
        />
        <div className="mt-2 text-center text-sm">
          로그인 서비스 이용 시{' '}
          <span className="font-bold text-destructive">
            다른 브라우저로 열기
          </span>{' '}
          를 선택해주세요.
        </div>
        <button
          onClick={handleClose}
          className="mt-4 h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

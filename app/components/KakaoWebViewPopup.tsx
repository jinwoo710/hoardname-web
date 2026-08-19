'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';

import { openInExternalBrowser, buildGoogleAutoLoginUrl } from '../lib/webview';
import { KAKAO_LOGIN_ENABLED } from '../lib/featureFlags';
import { KakaoIcon } from './common/KakaoIcon';

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
    const hasSeenPopup = getCookie(COOKIE_NAME);

    if (isKakaoWebView && !hasSeenPopup) {
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
          카카오톡 브라우저 안내
        </div>
        <div className="mt-2 text-center text-sm text-muted-foreground">
          카카오톡 브라우저에서는{' '}
          <span className="font-bold text-destructive">구글 로그인이 제한</span>
          돼요.{' '}
          {KAKAO_LOGIN_ENABLED
            ? '카카오 로그인을 이용해주세요.'
            : '외부 브라우저로 열어서 이용해주세요.'}
        </div>
        {KAKAO_LOGIN_ENABLED ? (
          <Button
            className="mt-4 h-11 w-full gap-2 bg-[#FEE500] text-black hover:bg-[#FADA00]"
            onClick={() => {
              handleClose();
              signIn('kakao', { callbackUrl: '/game' });
            }}
          >
            <KakaoIcon className="size-4" />
            카카오로 로그인
          </Button>
        ) : (
          <Button
            className="mt-4 h-11 w-full"
            onClick={() => {
              handleClose();
              openInExternalBrowser(buildGoogleAutoLoginUrl());
            }}
          >
            외부 브라우저로 열기
          </Button>
        )}
        <button
          onClick={handleClose}
          className="mt-2 h-11 w-full rounded-lg text-sm text-muted-foreground hover:bg-muted"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

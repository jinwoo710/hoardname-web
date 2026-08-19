'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  isKakaoWebView,
  openInExternalBrowser,
  buildGoogleAutoLoginUrl,
} from '../../lib/webview';
import { KAKAO_LOGIN_ENABLED } from '../../lib/featureFlags';
import { GoogleIcon } from './GoogleIcon';
import { KakaoIcon } from './KakaoIcon';

interface AuthMenuProps {
  variant?: 'inline' | 'block';
  onNavigate?: () => void;
}

export function AuthMenu({ variant = 'inline', onNavigate }: AuthMenuProps) {
  const { data: session, status } = useSession();

  const signInWithGoogle = () => {
    onNavigate?.();
    // 구글은 카카오톡 인앱 웹뷰에서의 로그인을 정책적으로 차단하므로,
    // 웹뷰 안이라면 카카오톡의 공식 스킴으로 외부 브라우저로 빠져나간 뒤 로그인하도록 유도한다.
    if (isKakaoWebView()) {
      openInExternalBrowser(buildGoogleAutoLoginUrl());
      return;
    }
    signIn('google', { callbackUrl: '/game' });
  };

  const signInWithKakao = () => {
    onNavigate?.();
    signIn('kakao', { callbackUrl: '/game' });
  };

  const handleSignOut = () => {
    onNavigate?.();
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="flex h-11 items-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (session) {
    return (
      <div
        className={cn(
          'flex items-center gap-3',
          variant === 'block' && 'justify-between'
        )}
      >
        <span className="text-sm text-foreground">{session.user?.name}</span>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          로그아웃
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        variant === 'block' && 'w-full flex-col'
      )}
    >
      <Button
        variant="outline"
        className={cn('h-11 gap-2', variant === 'block' && 'w-full')}
        onClick={signInWithGoogle}
      >
        <GoogleIcon className="size-4" />
        Google 로그인
      </Button>
      {KAKAO_LOGIN_ENABLED && (
        <Button
          className={cn(
            'h-11 gap-2 bg-[#FEE500] text-black hover:bg-[#FADA00]',
            variant === 'block' && 'w-full'
          )}
          onClick={signInWithKakao}
        >
          <KakaoIcon className="size-4" />
          카카오 로그인
        </Button>
      )}
    </div>
  );
}

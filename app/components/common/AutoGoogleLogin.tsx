'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

// 카카오 웹뷰에서 외부 브라우저로 튕겨나온 직후, ?autoLogin=google 이 붙어있으면
// 사용자가 다시 버튼을 누를 필요 없이 곧바로 구글 로그인을 이어서 진행한다.
export function AutoGoogleLogin() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('autoLogin') === 'google') {
      signIn('google', { callbackUrl: '/game' });
    }
  }, [searchParams]);

  return null;
}

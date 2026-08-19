'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { GoogleIcon } from './GoogleIcon';

interface AuthMenuProps {
  variant?: 'inline' | 'block';
  onNavigate?: () => void;
}

export function AuthMenu({ variant = 'inline', onNavigate }: AuthMenuProps) {
  const { data: session, status } = useSession();

  const signInWithGoogle = () => {
    onNavigate?.();
    signIn('google', { callbackUrl: '/game' });
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
    <Button
      variant="outline"
      className={cn('h-11 gap-2', variant === 'block' && 'w-full')}
      onClick={signInWithGoogle}
    >
      <GoogleIcon className="size-4" />
      Google 로그인
    </Button>
  );
}

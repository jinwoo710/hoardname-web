'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import { GoogleIcon } from '../components/common/GoogleIcon';
import { KakaoIcon } from '../components/common/KakaoIcon';
import { updateProfile } from '../actions/users';
import { isKakaoWebView } from '../lib/webview';

interface UserProfileClientProps {
  user: {
    email: string | null;
    nickname: string | null;
    openKakaotalkUrl: string | null;
    id: string;
  };
  linkedProviders: string[];
}

export default function UserProfileClient({
  user,
  linkedProviders,
}: UserProfileClientProps) {
  const searchParams = useSearchParams();
  const [nickname, setNickname] = useState(user.nickname || '');
  const [openKakaotalkUrl, setOpenKakaotalkUrl] = useState(
    user.openKakaotalkUrl || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('error') === 'OAuthAccountNotLinked') {
      toast.error('이미 다른 계정에 연결된 카카오 계정입니다.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (
      openKakaotalkUrl.length > 0 &&
      !openKakaotalkUrl.startsWith('https://open.kakao.com/')
    ) {
      setIsSubmitting(false);
      toast.error('올바른 카카오톡 오픈채팅 링크가 아닙니다.');
      return;
    }

    try {
      if (!user.id) {
        throw new Error('User ID is missing');
      }

      const response = await updateProfile(user.id, {
        nickname,
        openKakaotalkUrl: openKakaotalkUrl || '',
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      toast.success('프로필이 업데이트되었습니다.');
    } catch (error) {
      setError(`프로필 업데이트에 실패했습니다: ${error}`);
      toast.error('프로필 업데이트에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isKakaoLinked = linkedProviders.includes('kakao');
  const isGoogleLinked = linkedProviders.includes('google');

  const connectGoogle = () => {
    if (isKakaoWebView()) {
      toast.error(
        '카카오톡 브라우저에서는 구글 계정 연결이 제한됩니다. Safari/Chrome 앱에서 직접 접속해 로그인 후 연결해주세요.'
      );
      return;
    }
    signIn('google', { callbackUrl: '/user' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">프로필 설정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            value={user.email ?? '-'}
            disabled
            className="h-11"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nickname">
            닉네임 <span className="text-destructive">(필수)</span>
          </Label>
          <Input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="h-11"
            required
            placeholder="호드네임에서 사용중인 닉네임으로 변경해주세요"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="openKakaotalkUrl">카카오톡 오픈채팅 링크</Label>
          <Input
            id="openKakaotalkUrl"
            type="text"
            value={openKakaotalkUrl}
            onChange={(e) => setOpenKakaotalkUrl(e.target.value)}
            className="h-11"
            placeholder="https://open.kakao.com/"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
          {isSubmitting ? '저장 중...' : '저장'}
        </Button>
      </form>

      <div className="mt-8 space-y-3">
        <Label>연결된 계정</Label>
        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <div className="flex items-center gap-2">
            <GoogleIcon className="size-4" />
            <span className="text-sm">Google</span>
          </div>
          {isGoogleLinked ? (
            <Badge
              variant="outline"
              className="border-transparent bg-primary/10 text-primary"
            >
              연결됨
            </Badge>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={connectGoogle}
            >
              구글 계정 연결하기
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <div className="flex items-center gap-2">
            <KakaoIcon className="size-4" />
            <span className="text-sm">카카오</span>
          </div>
          {isKakaoLinked ? (
            <Badge
              variant="outline"
              className="border-transparent bg-primary/10 text-primary"
            >
              연결됨
            </Badge>
          ) : (
            <Button
              type="button"
              size="sm"
              className="bg-[#FEE500] text-black hover:bg-[#FADA00]"
              onClick={() => signIn('kakao', { callbackUrl: '/user' })}
            >
              카카오 계정 연결하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

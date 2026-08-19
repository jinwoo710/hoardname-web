'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { updateProfile } from '../actions/users';

interface UserProfileClientProps {
  user: {
    email: string;
    nickname: string | null;
    openKakaotalkUrl: string | null;
    id: string;
  };
}

export default function UserProfileClient({ user }: UserProfileClientProps) {
  const [nickname, setNickname] = useState(user.nickname || '');
  const [openKakaotalkUrl, setOpenKakaotalkUrl] = useState(
    user.openKakaotalkUrl || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">프로필 설정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            value={user.email}
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
    </div>
  );
}

'use client';

import { useState} from 'react';
import toast from 'react-hot-toast';
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
  const [openKakaotalkUrl, setOpenKakaotalkUrl] = useState(user.openKakaotalkUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (openKakaotalkUrl.length > 0 && !openKakaotalkUrl.startsWith('https://open.kakao.com/')) {
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
        <h1 className="text-2xl font-bold mb-6">프로필 설정</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              닉네임 <span className="text-red-500">(필수)</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              placeholder='호드네임에서 사용중인 닉네임으로 변경해주세요'
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카카오톡 오픈채팅 링크
            </label>
            <input
              type="text"
              value={openKakaotalkUrl}
              onChange={(e) => setOpenKakaotalkUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://open.kakao.com/"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
        </form>
      </div>
  );
}

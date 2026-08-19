'use client';

import { useSession } from 'next-auth/react';
import { FormEvent, useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { checkUser } from '../actions/users';
import { Spinner } from '../components/common/Spinner';
export const runtime = 'edge';

export default function Email() {
  const [loading, setLoading] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        if (emailRef.current && session.user?.email) {
          emailRef.current.value = session.user.email;
        }

        try {
          const result = await checkUser(session.user.id);

          if (nameRef.current) {
            nameRef.current.value = result.user?.nickname || '';
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          if (nameRef.current) {
            nameRef.current.value = '';
          }
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbymRuUlzDFIM_YW9AnIBLY8a04gSANtFmhVemHHtFnohD7_23YdLoz78JlbXaHeqXywAg/exec`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = (await response.json()) as { result: string };
      setLoading(false);

      if (data.result === 'success') {
        toast.success('문의가 성공적으로 접수되었습니다.');
        if (messageRef.current) {
          messageRef.current.value = '';
        }
      } else {
        toast.error('전송에 실패하였습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      toast.error(
        `전송 중 오류가 발생하였습니다. 관리자에게 문의주세요. 에러코드:${error}`
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">버그 및 문의하기</h1>
      </div>
      <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li>버그 및 페이지와 관련된 문의는 언제든 환영입니다.</li>

          <li>등록하고 싶은 게임이 검색이 안되는 케이스도 문의주세요.</li>
        </ul>
      </div>
      <form
        onSubmit={handleSubmit}
        data-email="travachess@gmail.com"
        className="relative mb-4 rounded-xl border bg-card p-6 shadow-sm"
      >
        {loading && (
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 py-4">
            <Spinner size="lg" />
          </div>
        )}
        <fieldset className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="userName">
              닉네임 (<span className="text-destructive">*</span>)
            </Label>
            <Input
              ref={nameRef}
              type="text"
              id="userName"
              name="name"
              className="h-11"
              placeholder="닉네임"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="userEmail">이메일</Label>
            <Input
              ref={emailRef}
              type="email"
              id="userEmail"
              name="email"
              className="h-11"
              placeholder="이메일"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="userMessage">
              내용 (<span className="text-destructive">*</span>)
            </Label>
            <Textarea
              ref={messageRef}
              name="message"
              id="userMessage"
              className="min-h-[150px] resize-none"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="h-11 w-full">
            {loading ? '제출 중...' : '제출하기'}
          </Button>
        </fieldset>
      </form>
    </div>
  );
}

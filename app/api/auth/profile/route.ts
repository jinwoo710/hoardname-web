import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { users } from '@/db/schema';
import { auth } from '@/auth';
export const runtime = 'edge';

interface UpdateProfileRequest {
  nickname: string;
  openKakaotalkUrl: string;
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { nickname, openKakaotalkUrl } =
      (await request.json()) as UpdateProfileRequest;

    await db
      .update(users)
      .set({
        nickname,
        openKakaotalkUrl,
      })
      .where(eq(users.id, session.user.id))
      .run();

    return new NextResponse('Profile updated', { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return new NextResponse('Error updating profile', { status: 500 });
  }
}

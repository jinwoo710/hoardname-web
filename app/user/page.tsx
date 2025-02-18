import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

import { auth } from '@/app/api/auth/[...nextauth]/auth';
import { db } from '@/db';
import { users } from '@/db/schema';

import UserProfileClient from './UserProfileClient';
export const runtime = 'edge';

export default async function UserProfile() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/');
  }

  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .get();

  if (!dbUser) {
    redirect('/');
  }

  return (
    <UserProfileClient
      user={{
        id: dbUser.id,
        email: session.user.email,
        nickname: dbUser?.nickname || null,
        openKakaotalkUrl: dbUser?.openKakaotalkUrl || null,
      }}
    />
  );
}

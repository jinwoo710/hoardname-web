import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

import { auth } from '@/auth';
import { db } from '@/db';
import { users, accounts } from '@/db/schema';

import UserProfileClient from './UserProfileClient';
export const runtime = 'edge';

export default async function UserProfile() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .get();

  if (!dbUser) {
    redirect('/');
  }

  const linkedAccounts = await db
    .select({ provider: accounts.provider })
    .from(accounts)
    .where(eq(accounts.userId, session.user.id));

  return (
    <UserProfileClient
      user={{
        id: dbUser.id,
        email: dbUser.email,
        nickname: dbUser?.nickname || null,
        openKakaotalkUrl: dbUser?.openKakaotalkUrl || null,
      }}
      linkedProviders={linkedAccounts.map((a) => a.provider)}
    />
  );
}

import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { auth } from '@/auth';
import { users } from '@/db/schema';
import { ShopItem } from '@/types/boardgame';

import UserShop from './UserShop';
import { fetchUserShop } from '../actions/userShop';
export const runtime = 'edge';

const LIMIT = 20;

export default async function UserShopPage() {
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

  const { items } = await fetchUserShop({
    page: 1,
    limit: LIMIT,
    userId: dbUser.id,
  });
  return (
    <UserShop
      initialShopItems={items as ShopItem[]}
      userId={dbUser.id}
      limit={LIMIT}
    />
  );
}

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import UserGame from './UserGame';
import { fetchUserGames } from '../actions/userGames';
export const runtime = 'edge';

const LIMIT = 20;

export default async function UserGamePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/');

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!dbUser) {
    redirect('/');
  }
  

  const result = await fetchUserGames({
    page: 1,
    limit: LIMIT,
    search: '',
    ownerId: dbUser.id
  });

  return (
    <UserGame
      initialBoardgames={result.items}
      userId={dbUser.id}
      limit={LIMIT}
    />
  );
}

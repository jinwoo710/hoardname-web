import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import UserGame from "./UserGame";
import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { users, boardgames } from "@/db/schema";
import { BoardGame } from "@/types/boardgame";
export const runtime = "edge";

export default async function UserGamePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .get();

  if (!dbUser) {
    redirect("/");
  }

  const userGames = await db
    .select({
      id: boardgames.id,
      name: boardgames.name,
      originalName: boardgames.originalName,
      weight: boardgames.weight,
      bestWith: boardgames.bestWith,
      recommendedWith: boardgames.recommendedWith,
      minPlayers: boardgames.minPlayers,
      maxPlayers: boardgames.maxPlayers,
      thumbnailUrl: boardgames.thumbnailUrl,
      imageUrl: boardgames.imageUrl,
      imported: boardgames.imported,
      bggId: boardgames.bggId,
      createdAt: boardgames.createdAt,
    })
    .from(boardgames).where(eq(boardgames.ownerId, dbUser.id))
     .orderBy(desc(boardgames.imported), desc(boardgames.createdAt))
      .limit(20)

  return (
    <UserGame
      initialBoardgames={userGames as BoardGame[]}
    />
  );
}

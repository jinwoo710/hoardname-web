import GameList from "./GameList";
import { db } from "@/db";
import { boardgames, users } from "@/db/schema";
import { BoardGame } from "@/types/boardgame";
import { eq, desc } from "drizzle-orm";
export const runtime = "edge";

const LIMIT = 20;

export default async function Game() {
  const results = await db
    .select({
      id: boardgames.id,
      name: boardgames.name,
      originalName: boardgames.originalName,
      ownerId: boardgames.ownerId,
      ownerNickname: users.nickname,
      inStorage: boardgames.inStorage,
      bggId: boardgames.bggId,
      weight: boardgames.weight,
      bestWith: boardgames.bestWith,
      recommendedWith: boardgames.recommendedWith,
      minPlayers: boardgames.minPlayers,
      maxPlayers: boardgames.maxPlayers,
      thumbnailUrl: boardgames.thumbnailUrl,
      imageUrl: boardgames.imageUrl,
      createdAt: boardgames.createdAt,
    })
    .from(boardgames)
    .leftJoin(users, () => eq(users.id, boardgames.ownerId))
    .orderBy(desc(boardgames.inStorage), desc(boardgames.createdAt))
    .limit(LIMIT)
    .offset(0);

  const initialBoardgames = results as BoardGame[];

  return (
    <GameList initialBoardgames={initialBoardgames} limit={LIMIT} />
  );
}
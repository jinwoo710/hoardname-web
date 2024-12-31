import GameList from "./GameList";
import { db } from "@/db";
import { boardgames, users } from "@/db/schema";
import { BoardGame } from "@/types/boardgame";
import { eq, desc } from "drizzle-orm";
export const runtime = "edge";

export default async function Game() {
  // 서버 컴포넌트에서 데이터 불러오기
  const results = await db
    .select({
      id: boardgames.id,
      name: boardgames.name,
      originalName: boardgames.originalName,
      ownerId: boardgames.ownerId,
      ownerNickname: users.nickname,
      imported: boardgames.imported,
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
    .orderBy(desc(boardgames.imported), desc(boardgames.createdAt));

  const initialBoardgames = results as BoardGame[];

  return (
    <GameList initialBoardgames={initialBoardgames} />
  );
}
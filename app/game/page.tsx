import GameList from "./GameList";
import { db } from "@/db";
import { boardgames } from "@/db/schema";
import { BoardGame } from "@/types/boardgame";
export const runtime = "edge";

export default async function Game() {
  // 서버 컴포넌트에서 데이터 불러오기
  const results = await db.select().from(boardgames);
  const initialBoardgames = results as BoardGame[];

  return (
    <GameList initialBoardgames={initialBoardgames} />
  );
}
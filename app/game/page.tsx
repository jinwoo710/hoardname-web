import GameList from "./GameList";
import { BoardGame } from "@/types/boardgame";
import { fetchBoardgames } from "../actions/boardgames";
export const runtime = "edge";

const LIMIT = 20;

export default async function Game() {

  const result = await fetchBoardgames({
    page: 1,
    limit: LIMIT,
    search: '',
  });

  const initialBoardgames = result.items as BoardGame[]

  return (
    <GameList initialBoardgames={initialBoardgames} limit={LIMIT} />
  );
}
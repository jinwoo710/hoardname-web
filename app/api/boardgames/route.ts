import { drizzle } from "drizzle-orm/d1";
import { boardgames } from "@/db/schema";
import type { BoardGame, CreateBoardGame } from "@/types/boardgame";

export const runtime = "edge";

export async function GET(request: Request, { DB }: { DB: D1Database }) {
  const db = drizzle(DB);

  try {
    const results = await db.select().from(boardgames);
    return Response.json({ data: results as BoardGame[] });
  } catch (error) {
    console.error("Error fetching boardgames:", error);
    return Response.json(
      { error: "Failed to fetch boardgames" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { DB }: { DB: D1Database }) {
  const db = drizzle(DB);
  const data = (await request.json()) as CreateBoardGame;

  try {
    const result = await db.insert(boardgames).values({
      name: data.name,
      originalName: data.originalName,
      ownerId: data.ownerId,
      bggId: data.bggId,
      weight: data.weight,
      bestWith: data.bestWith,
      recommendedWith: data.recommendedWith,
      minPlayers: data.minPlayers,
      maxPlayers: data.maxPlayers,
      thumbnailUrl: data.thumbnailUrl,
      imageUrl: data.imageUrl,
    });

    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating boardgame:", error);
    return Response.json(
      { error: "Failed to create boardgame" },
      { status: 500 }
    );
  }
}

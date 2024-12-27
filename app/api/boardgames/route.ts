import { db } from "@/db";
import { boardgames } from "@/db/schema";
import type { BoardGame, CreateBoardGame } from "@/types/boardgame";

export const runtime = "edge";

export async function GET() {
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

export async function POST(request: Request) {
  const data = (await request.json()) as CreateBoardGame;

  try {
    const result = await db
      .insert(boardgames)
      .values({
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
      })
      .returning();

    const newBoardGame = result[0] as BoardGame;
    return Response.json({ boardgame: newBoardGame });
  } catch (error) {
    console.error("Error creating boardgame:", error);
    return Response.json(
      { error: "Failed to create boardgame" },
      { status: 500 }
    );
  }
}

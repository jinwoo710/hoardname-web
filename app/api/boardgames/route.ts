import { db } from "@/db";
import { boardgames } from "@/db/schema";
import type {
  BoardGame,
  CreateBoardGame,
  UpdateBoardGame,
} from "@/types/boardgame";
import { eq } from "drizzle-orm";

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
        originalName: data.originalName || data.name,
        ownerId: data.ownerId,
        bggId: data.bggId || null,
        weight: data.weight || null,
        bestWith: data.bestWith || null,
        recommendedWith: data.recommendedWith || null,
        minPlayers: data.minPlayers || null,
        maxPlayers: data.maxPlayers || null,
        thumbnailUrl: data.thumbnailUrl || null,
        imageUrl: data.imageUrl || null,
        imported: true,
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

export async function PATCH(request: Request) {
  const data = (await request.json()) as UpdateBoardGame;
  const { id, imported } = data;

  try {
    const result = await db
      .update(boardgames)
      .set({ imported })
      .where(eq(boardgames.id, id))
      .returning();

    if (!result.length) {
      return Response.json({ error: "Boardgame not found" }, { status: 404 });
    }

    const updatedBoardGame = result[0] as BoardGame;
    return Response.json({ boardgame: updatedBoardGame });
  } catch (error) {
    console.error("Error updating boardgame:", error);
    return Response.json(
      { error: "Failed to update boardgame" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Game ID is required" }, { status: 400 });
  }

  try {
    const result = await db
      .delete(boardgames)
      .where(eq(boardgames.id, parseInt(id)))
      .returning();

    if (!result.length) {
      return Response.json({ error: "Boardgame not found" }, { status: 404 });
    }

    const deletedBoardGame = result[0] as BoardGame;
    return Response.json({ boardgame: deletedBoardGame });
  } catch (error) {
    console.error("Error deleting boardgame:", error);
    return Response.json(
      { error: "Failed to delete boardgame" },
      { status: 500 }
    );
  }
}

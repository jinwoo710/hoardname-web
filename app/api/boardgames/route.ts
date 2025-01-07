import { db } from "@/db";
import { boardgames } from "@/db/schema";
import type {
  BoardGame,
  CreateBoardGame,
  UpdateBoardGame,
} from "@/types/boardgame";
import { eq, like, or, desc, sql, and, asc } from "drizzle-orm";
import { users } from "@/db/schema";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const ownerId = searchParams.get("ownerId");
  const weightSort = searchParams.get("weightSort");
  const bestWith = searchParams.get("bestWith");

  const offset = (page - 1) * limit;

  try {
    let whereClause = undefined;
    if (search) {
      whereClause = or(
        like(boardgames.name, `%${search}%`),
        like(boardgames.originalName, `%${search}%`)
      );
    }
    if (ownerId) {
      const ownerCondition = eq(boardgames.ownerId, ownerId);
      whereClause = whereClause
        ? and(whereClause, ownerCondition)
        : ownerCondition;
    }

    if (bestWith) {
      const bestWithCondition =
        bestWith === "5"
          ? or(
              eq(boardgames.bestWith, "5"),
              eq(boardgames.bestWith, "6"),
              eq(boardgames.bestWith, "7"),
              eq(boardgames.bestWith, "8"),
              eq(boardgames.bestWith, "9"),
              eq(boardgames.bestWith, "10"),
              eq(boardgames.bestWith, "12"),
              eq(boardgames.bestWith, "13"),
              eq(boardgames.bestWith, "14"),
              eq(boardgames.bestWith, "15")
            )
          : eq(boardgames.bestWith, bestWith);
      whereClause = whereClause
        ? and(whereClause, bestWithCondition)
        : bestWithCondition;
    }

    let orderByClause = [asc(boardgames.inStorage), desc(boardgames.createdAt)];
    if (weightSort) {
      if (weightSort === "asc") {
        orderByClause = [asc(boardgames.weight), ...orderByClause];
      } else if (weightSort === "desc") {
        orderByClause = [desc(boardgames.weight), ...orderByClause];
      }
    }

    const totalResult = await db
      .select({ count: sql`count(*)` })
      .from(boardgames)
      .where(whereClause || undefined);

    const total = Number(totalResult[0].count);

    const items = await db
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
      .where(whereClause || undefined)
      .orderBy(...orderByClause)
      .limit(limit)
      .offset(offset);

    const remainingItems = total - (offset + limit);
    const hasMore = remainingItems > 0;

    return Response.json({
      items,
      hasMore,
      total,
    });
  } catch (error) {
    console.error("Error fetching boardgames:", error);
    return Response.json(
      { error: "Failed to fetch boardgames" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as CreateBoardGame;

    const existingGame = await db
      .select()
      .from(boardgames)
      .where(
        sql`${boardgames.bggId} = ${data.bggId} AND ${boardgames.ownerId} = ${data.ownerId}`
      )
      .limit(1);

    if (existingGame.length > 0) {
      return Response.json(
        { error: "이미 등록된 게임입니다." },
        { status: 400 }
      );
    }

    const result = await db
      .insert(boardgames)
      .values({
        name: data.name,
        originalName: data.originalName || data.name,
        ownerId: data.ownerId,
        bggId: data.bggId || null,
        weight: data.weight || null,
        bestWith: data.bestWith || null,
        recommendedWith: data.recommendedWith
          ? JSON.stringify(data.recommendedWith)
          : null,
        minPlayers: data.minPlayers || null,
        maxPlayers: data.maxPlayers || null,
        thumbnailUrl: data.thumbnailUrl || null,
        imageUrl: data.imageUrl || null,
        inStorage: true,
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
  const { id, inStorage } = data;

  try {
    const result = await db
      .update(boardgames)
      .set({ inStorage })
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

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting boardgame:", error);
    return Response.json(
      { error: "Failed to delete boardgame" },
      { status: 500 }
    );
  }
}

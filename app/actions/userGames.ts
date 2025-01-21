"use server";

import { db } from "@/db";
import { boardgames, users } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { CreateBoardGame, UpdateBoardGame } from "@/types/boardgame";
import type { SQL } from "drizzle-orm";

interface FetchUserGamesParams {
  page: number;
  limit: number;
  search?: string;
  ownerId: string;
}

export async function fetchUserGames({
  page,
  limit,
  search,
  ownerId,
}: FetchUserGamesParams) {
  try {
    const offset = (page - 1) * limit;

    const conditions: SQL<unknown>[] = [eq(boardgames.ownerId, ownerId)];

    if (search) {
      conditions.push(
        sql`(${boardgames.name} LIKE ${`%${search}%`} OR ${
          boardgames.originalName
        } LIKE ${`%${search}%`})`
      );
    }

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
      .where(and(...conditions))
      .orderBy(desc(boardgames.createdAt), desc(boardgames.id))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(boardgames)
      .where(and(...conditions));

    const hasMore = offset + items.length < count;

    return {
      items,
      hasMore,
      total: count,
    };
  } catch (error) {
    throw new Error(`Failed to fetch games: ${error}`);
  }
}

export async function createUserGame(data: CreateBoardGame) {
  try {
    const existingGame = await db
      .select()
      .from(boardgames)
      .where(
        and(
          eq(boardgames.ownerId, data.ownerId),
          eq(boardgames.bggId, data.bggId)
        )
      )
      .limit(1);

    if (existingGame.length > 0) {
      return { success: false, error: "이미 등록된 게임입니다." };
    }

    const [newGame] = await db
      .insert(boardgames)
      .values({
        ...data,
        originalName: data.originalName || "",
      })
      .returning();

    revalidatePath("/userGame");
    return { success: true, game: newGame };
  } catch (error) {
    return { success: false, error: `게임 추가에 실패했습니다: ${error}` };
  }
}

export async function updateUserGame(data: UpdateBoardGame) {
  try {
    const [updatedGame] = await db
      .update(boardgames)
      .set(data)
      .where(eq(boardgames.id, Number(data.id)))
      .returning();
    revalidatePath("/userGame");
    return { success: true, game: updatedGame };
  } catch (error) {
    return { success: false, error: `Failed to update game: ${error}` };
  }
}

export async function deleteUserGame(id: string) {
  try {
    await db.delete(boardgames).where(eq(boardgames.id, Number(id)));
    revalidatePath("/userGame");
    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to delete game: ${error}` };
  }
}

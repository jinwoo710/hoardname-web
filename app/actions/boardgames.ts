'use server';

import { eq, and, sql, desc, asc } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';

import { db } from '@/db';
import { boardgames } from '@/db/schema';
import { users } from '@/db/schema';

export interface FetchBoardgamesParams {
  page: number;
  limit: number;
  search?: string;
  weightSort?: string;
  bestWith?: string;
  playerCount?: string;
  recommendedWith?: string;
  inStorage?: string;
}

export async function fetchBoardgames({
  page,
  limit,
  search,
  weightSort,
  bestWith,
  playerCount,
  recommendedWith,
  inStorage,
}: FetchBoardgamesParams) {
  try {
    const offset = (page - 1) * limit;

    const conditions: SQL<unknown>[] = [];
    let orderByClause = [desc(boardgames.createdAt), desc(boardgames.id)];

    if (search) {
      conditions.push(
        sql`(${boardgames.name} LIKE ${`%${search}%`} OR ${
          boardgames.originalName
        } LIKE ${`%${search}%`})`
      );
    }
    if (bestWith) {
      const bestWithCondition =
        bestWith === '5'
          ? sql`CAST(${boardgames.bestWith} AS INTEGER) >= 5`
          : sql`${boardgames.bestWith} = ${bestWith}`;

      conditions.push(bestWithCondition);
    }

    if (playerCount) {
      const count = parseInt(playerCount);
      conditions.push(
        count === 9
          ? sql`(${boardgames.minPlayers} >= ${count} OR ${boardgames.maxPlayers} >= ${count})`
          : sql`${boardgames.minPlayers} <= ${count} AND ${boardgames.maxPlayers} >= ${count}`
      );
    }
    if (recommendedWith) {
      const count = parseInt(recommendedWith);
      conditions.push(
        recommendedWith === '5'
          ? sql`CAST(${boardgames.recommendedWith} AS INTEGER) >= 5 OR (
              ${boardgames.recommendedWith} LIKE '%-%' AND 
              CAST(SUBSTR(${boardgames.recommendedWith}, INSTR(${boardgames.recommendedWith}, '-') + 1) AS INTEGER) >= 5
            )`
          : sql`${boardgames.recommendedWith} LIKE ${
              '%' + recommendedWith + '%'
            } OR (
              ${boardgames.recommendedWith} LIKE '%-%' AND 
              CAST(SUBSTR(${boardgames.recommendedWith}, 1, INSTR(${
                boardgames.recommendedWith
              }, '-') - 1) AS INTEGER) <= ${count} AND
              CAST(SUBSTR(${boardgames.recommendedWith}, INSTR(${
                boardgames.recommendedWith
              }, '-') + 1) AS INTEGER) >= ${count}
            )`
      );
    }

    if (weightSort) {
      if (weightSort === 'asc') {
        orderByClause = [asc(boardgames.weight), ...orderByClause];
      } else if (weightSort === 'desc') {
        orderByClause = [desc(boardgames.weight), ...orderByClause];
      }
    }

    if (inStorage) {
      if (inStorage === 'true') {
        conditions.push(sql`${boardgames.inStorage} = true`);
      } else if (inStorage === 'false') {
        conditions.push(sql`${boardgames.inStorage} = false`);
      }
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
      .orderBy(...orderByClause)
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

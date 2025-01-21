"use server";

import { db } from "@/db";
import { shop, users } from "@/db/schema";
import { eq, desc, and, sql, asc } from "drizzle-orm";
import type { SQL } from "drizzle-orm";

interface FetchShopItemsParams {
  page: number;
  limit: number;
  search?: string;
  priceSort?: string;
}

export async function fetchShopItems({
  page,
  limit,
  search,
  priceSort,
}: FetchShopItemsParams) {
  try {
    const offset = (page - 1) * limit;
    const conditions: SQL<unknown>[] = [eq(shop.isDeleted, false)];
    let orderByClause = [desc(shop.createdAt), desc(shop.id)];

    if (search) {
      conditions.push(
        sql`(${shop.name} LIKE ${`%${search}%`} OR ${
          shop.originalName
        } LIKE ${`%${search}%`})`
      );
    }

    if (priceSort) {
      if (priceSort === "asc")
        orderByClause = [asc(shop.price), ...orderByClause];
      if (priceSort === "desc")
        orderByClause = [desc(shop.price), ...orderByClause];
    }

    const items = await db
      .select({
        id: shop.id,
        name: shop.name,
        originalName: shop.originalName,
        ownerId: shop.ownerId,
        ownerNickname: users.nickname,
        openKakaoUrl: users.openKakaotalkUrl,
        price: shop.price,
        thumbnailUrl: shop.thumbnailUrl,
        createdAt: shop.createdAt,
        memo: shop.memo,
        isDeleted: shop.isDeleted,
        isOnSale: shop.isOnSale,
      })
      .from(shop)
      .leftJoin(users, eq(shop.ownerId, users.id))
      .where(and(...conditions))
      .orderBy(...orderByClause)
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(shop)
      .where(and(...conditions));

    const hasMore = offset + items.length < count;

    return {
      items,
      hasMore,
      total: count,
    };
  } catch (error) {
    throw new Error(`Failed to fetch shop items: ${error}`);
  }
}

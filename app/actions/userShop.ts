'use server';

import { eq, desc, and, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { shop, users } from '@/db/schema';
import type { CreateShopItem, ShopItem } from '@/types/boardgame';

interface FetchUserShopParams {
  page: number;
  limit: number;
  userId: string;
  search?: string;
}

export async function fetchUserShop({
  page,
  limit,
  userId,
  search,
}: FetchUserShopParams) {
  const offset = (page - 1) * limit;
  const conditions: SQL<unknown>[] = [
    eq(shop.ownerId, userId),
    eq(shop.isDeleted, false),
  ];

  if (search) {
    conditions.push(
      sql`(${shop.name} LIKE ${`%${search}%`} OR ${
        shop.originalName
      } LIKE ${`%${search}%`})`
    );
  }

  try {
    const items = await db
      .select({
        id: shop.id,
        name: shop.name,
        originalName: shop.originalName,
        thumbnailUrl: shop.thumbnailUrl,
        price: shop.price,
        isOnSale: shop.isOnSale,
        memo: shop.memo,
        isDeleted: shop.isDeleted,
        ownerId: shop.ownerId,
        ownerNickname: users.nickname,
        openKakaoUrl: users.openKakaotalkUrl,
        createdAt: shop.createdAt,
      })
      .from(shop)
      .leftJoin(users, eq(shop.ownerId, users.id))
      .where(and(...conditions))
      .orderBy(desc(shop.createdAt))
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
      items: items as ShopItem[],
      hasMore,
      total: count,
    };
  } catch (error) {
    throw new Error(`Failed to fetch items: ${error}`);
  }
}

export async function CreateShopItem(item: CreateShopItem) {
  try {
    await db.insert(shop).values(item);
    revalidatePath('/shop');
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function UpdateShopItem(item: Partial<ShopItem> & { id: number }) {
  try {
    await db.update(shop).set(item).where(eq(shop.id, item.id));
    revalidatePath('/shop');
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

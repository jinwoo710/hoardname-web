import { NextResponse } from "next/server";
import { db } from "@/db";
import { shop, users } from "@/db/schema";
import { CreateShopItem, ShopItem } from "@/types/boardgame";
import { eq, desc, sql, like, or, and, asc } from "drizzle-orm";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as CreateShopItem;

    const result = await db.insert(shop).values({
      name: data.name,
      originalName: data.originalName,
      thumbnailUrl: data.thumbnailUrl,
      price: data.price,
      ownerId: data.ownerId,
      memo: data.memo || null,
      isDeleted: false,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error in POST /api/shop:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const ownerId = searchParams.get("ownerId");
    const priceSort = searchParams.get("priceSort");
    const offset = (page - 1) * limit;

    let whereClause = undefined;
    if (search) {
      whereClause = or(
        like(shop.name, `%${search}%`),
        like(shop.originalName, `%${search}%`)
      );
    }

    if (ownerId) {
      const ownerCondition = eq(shop.ownerId, ownerId);
      whereClause = whereClause
        ? and(whereClause, ownerCondition)
        : ownerCondition;
    }

    whereClause = whereClause
      ? and(whereClause, eq(shop.isDeleted, false))
      : eq(shop.isDeleted, false);

    let orderByClause = [desc(shop.createdAt)];

    if (priceSort) {
      if (priceSort === "asc") {
        orderByClause = [asc(shop.price), ...orderByClause];
      } else if (priceSort === "desc") {
        orderByClause = [desc(shop.price), ...orderByClause];
      }
    }

    const totalResult = await db
      .select({ count: sql`count(*)` })
      .from(shop)
      .where(whereClause || undefined);

    const total = Number(totalResult[0].count);

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
      .where(whereClause || undefined)
      .orderBy(...orderByClause)
      .limit(limit)
      .offset(offset);

    const remainingItems = total - (offset + limit);
    const hasMore = remainingItems > 0;

    return NextResponse.json({
      items,
      hasMore,
      total,
    });
  } catch (error) {
    console.error("Error fetching shop items:", error);
    return NextResponse.json(
      { error: "Failed to fetch shop items" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const data = (await request.json()) as ShopItem;
  const { id, isDeleted, isOnSale } = data;

  try {
    const result = await db
      .update(shop)
      .set({ isDeleted, isOnSale })
      .where(eq(shop.id, id))
      .returning();

    if (!result.length) {
      return Response.json({ error: "shopItem not found" }, { status: 404 });
    }

    const updatedShopItem = result[0] as ShopItem;
    return Response.json({ shopItem: updatedShopItem });
  } catch (error) {
    console.error("Error updating shopItem:", error);
    return Response.json(
      { error: "Failed to update shopItem" },
      { status: 500 }
    );
  }
}

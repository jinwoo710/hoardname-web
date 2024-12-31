import { NextResponse } from "next/server";
import { db } from "@/db";
import { shop, users } from "@/db/schema";
import { CreateShopItem } from "@/types/boardgame";
import { eq } from "drizzle-orm";

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

export async function GET() {
  try {
    const items = await db
      .select({
        id: shop.id,
        name: shop.name,
        originalName: shop.originalName,
        thumbnailUrl: shop.thumbnailUrl,
        price: shop.price,
        ownerId: shop.ownerId,
        ownerNickname: users.nickname,
        openKakaoUrl: users.openKakaotalkUrl,
      })
      .from(shop)
      .leftJoin(users, eq(shop.ownerId, users.id));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error in GET /api/shop:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

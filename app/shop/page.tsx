import ShopList from "./ShopList";
import { db } from "@/db";
import { shop, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ShopItem } from "@/types/boardgame";

export const runtime = "edge";

const LIMIT = 20;

export default async function Shop() {
  const results = await db
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
      isDeleted: shop.isDeleted
    })
    .from(shop)
    .leftJoin(users, eq(shop.ownerId, users.id))
    .orderBy(desc(shop.createdAt))
    .limit(LIMIT) as ShopItem[];

  return (
    <ShopList initialShopItems={results} limit={LIMIT} />
  );
}
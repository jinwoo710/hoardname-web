import ShopList from "./ShopList";
import { db } from "@/db";
import { shop, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ShopItem } from "@/types/boardgame";

export const runtime = "edge";

export default async function Shop() {
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
    .leftJoin(users, eq(shop.ownerId, users.id)) as ShopItem[];

  return <ShopList initialShopItems={items} />;
}
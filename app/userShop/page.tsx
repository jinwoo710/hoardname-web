import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import UserShop from "./UserShop";
import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { users, shop } from "@/db/schema";
import { ShopItem } from "@/types/boardgame";
export const runtime = "edge";

const LIMIT = 20;

export default async function UserShopPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .get();

  if (!dbUser) {
    redirect("/");
  }

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
    .where(eq(shop.ownerId, dbUser.id))
    .orderBy(desc(shop.createdAt))
    .limit(LIMIT) as ShopItem[];

  return (
    <UserShop
      initialShopItems={results as ShopItem[]}
      userId={dbUser.id}
      limit={LIMIT}
    />
  );
}

import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import UserShop from "./UserShop";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { ShopItem } from "@/types/boardgame";
import { fetchUserShop } from "../actions/userShop";
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

  const { items } = await fetchUserShop({
    page: 1,
    limit: LIMIT,
    userId: dbUser.id
  });
  return (
    <UserShop
      initialShopItems={items as ShopItem[]}
      userId={dbUser.id}
      limit={LIMIT}
    />
  );
}

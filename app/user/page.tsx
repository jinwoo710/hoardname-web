import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import UserProfileClient from "./UserProfileClient";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
export const runtime = "edge";

export default async function UserProfile() {
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

  return (
    <UserProfileClient
      user={{
        email: session.user.email,
        nickname: dbUser?.nickname || null,
        openKakaotalkUrl: dbUser?.openKakaotalkUrl || null,
      }}
    />
  );
}

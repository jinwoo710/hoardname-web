import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/app/api/auth/[...nextauth]/auth";

export const runtime = "edge";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      hasNickname: !!user.nickname,
      nickname: user.nickname,
      openKakaotalkUrl: user.openKakaotalkUrl,
    });
  } catch (error) {
    console.error("Error checking user:", error);
    return Response.json({ error: "Failed to check user" }, { status: 500 });
  }
}

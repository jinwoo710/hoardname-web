"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface UpdateProfileParams {
  nickname: string;
  openKakaotalkUrl: string;
}

export async function checkUser(userId: string) {
  try {
    const result = await db
      .select({
        id: users.id,
        openKakaotalkUrl: users.openKakaotalkUrl,
        nickname: users.nickname,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (result.length === 0) {
      return { error: "User not found" };
    }

    return { user: result[0] };
  } catch (error) {
    return { error: `Failed to fetch user: ${error}` };
  }
}

export async function updateProfile(
  userId: string,
  { nickname, openKakaotalkUrl }: UpdateProfileParams
) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    await db
      .update(users)
      .set({
        nickname,
        openKakaotalkUrl: openKakaotalkUrl === "" ? null : openKakaotalkUrl,
      })
      .where(eq(users.id, userId));

    revalidatePath("/user");
    return { success: true };
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return { success: false, error: `Failed to update profile: ${error}` };
  }
}

export const runtime = "edge";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextAuthOptions, type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nickname: string | null;
      openKakaotalkUrl: string | null;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id),
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.nickname = dbUser.nickname;
          session.user.openKakaotalkUrl = dbUser.openKakaotalkUrl;
        }
      }
      return session;
    },
    async signIn({ account }) {
      if (account?.type === "oauth" && account?.provider === "google") {
        console.log(account);
        return true;
      }
      return false;
    },
  },
};

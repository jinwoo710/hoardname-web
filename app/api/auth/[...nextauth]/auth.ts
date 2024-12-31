import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
export const runtime = "edge";

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update, // Beta!
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent", // 사용자에게 항상 동의 화면을 표시하도록 강제!
        },
      },
    }),
  ],
  session: {
    strategy: "jwt", // JSON Web Token 사용
  },
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (account?.provider === "google") {
        return !!profile?.email_verified;
      }
      return true;
    },
    jwt: async ({ token }) => {
      return token;
    },
    async session({ session }) {
      return session;
    },
  },
});

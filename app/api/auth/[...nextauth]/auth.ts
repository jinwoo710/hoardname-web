import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
export const runtime = 'edge';

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update,
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (account?.provider === 'google') {
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

/**
 * Lightweight auth for proxy/edge — no DB imports.
 * Reads JWT from cookie using NextAuth's built-in JWT utils.
 */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { auth: proxyAuth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "employee";
        session.user.status = (token.status as string) ?? "unverified";
      }
      return session;
    },
  },
});

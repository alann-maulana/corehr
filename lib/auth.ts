import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// ─── Mock user untuk dev (tanpa DB) ────────────────────────────────────────
const MOCK_USER = {
  id: "mock-admin-1",
  name: "Mock Admin",
  email: process.env.MOCK_LOGIN_EMAIL ?? "admin@corehr.dev",
  image: null,
  role: "admin",
  status: "verified",
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ── Mock Login — hanya development ─────────────────────────────────────
    Credentials({
      id: "mock-credentials",
      name: "Mock Login (Dev)",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Hanya aktif di development
        if (process.env.NODE_ENV === "production") return null;

        const mockEmail =
          process.env.MOCK_LOGIN_EMAIL ?? "admin@corehr.dev";
        const mockPassword =
          process.env.MOCK_LOGIN_PASSWORD ?? "admin123";

        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          console.warn("[Mock Auth] Missing email or password");
          return null;
        }

        if (email !== mockEmail || password !== mockPassword) {
          console.warn("[Mock Auth] Wrong credentials:", { email, expected: mockEmail });
          return null;
        }

        console.log("[Mock Auth] Login success for:", email);

        // Return user langsung tanpa DB
        return {
          id: MOCK_USER.id,
          name: MOCK_USER.name,
          email: MOCK_USER.email,
          image: MOCK_USER.image,
        };
      },
    }),
  ],

  callbacks: {
    // ── JWT: inject role & status ke token ──────────────────────────────────
    async jwt({ token, user, account }) {
      // Pertama kali sign-in (user & account tersedia)
      if (user && account) {
        // Mock credentials login — inject langsung tanpa DB
        if (account.provider === "mock-credentials") {
          token.id = MOCK_USER.id;
          token.role = MOCK_USER.role;
          token.status = MOCK_USER.status;
          return token;
        }

        // Google login — coba query DB, fallback jika DB tidak ada
        if (account.provider === "google") {
          try {
            const { default: db } = await import("@/lib/db");
            const dbUser = await db("users")
              .where({ email: token.email! })
              .first("id", "role", "status", "name", "avatar_url");

            if (dbUser) {
              token.id = String(dbUser.id);
              token.role = dbUser.role;
              token.status = dbUser.status;
              token.name = dbUser.name;
              if (dbUser.avatar_url) token.picture = dbUser.avatar_url;
            } else {
              token.role = "employee";
              token.status = "unverified";
            }
          } catch {
            console.warn("[Auth] DB unavailable, using defaults for Google user");
            token.role = "employee";
            token.status = "unverified";
          }
        }
      }

      return token;
    },

    // ── Google signIn: upsert user ke DB ────────────────────────────────────
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { default: db } = await import("@/lib/db");
          const existing = await db("users")
            .where({ email: user.email! })
            .first("id", "google_id");

          if (!existing) {
            await db("users").insert({
              google_id: account.providerAccountId,
              name: user.name ?? "Unknown",
              email: user.email!,
              avatar_url: user.image ?? null,
              role: "employee",
              status: "unverified",
            });
          } else if (!existing.google_id) {
            await db("users")
              .where({ email: user.email! })
              .update({ google_id: account.providerAccountId });
          }
        } catch (err) {
          console.error("[Auth] DB error during Google signIn:", err);
          // Tetap izinkan login meskipun DB tidak tersedia
        }
      }
      return true;
    },

    // ── Session: ekspos role & status ke client ──────────────────────────────
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = (token.role as string) ?? "employee";
        session.user.status = (token.status as string) ?? "unverified";
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },

  debug: process.env.NODE_ENV === "development",
});

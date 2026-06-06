import { NextResponse } from "next/server";
import { encode } from "@auth/core/jwt";

// Dev-only mock login route — TIDAK tersedia di production
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password } = body;

  const mockEmail = process.env.MOCK_LOGIN_EMAIL ?? "admin@corehr.dev";
  const mockPassword = process.env.MOCK_LOGIN_PASSWORD ?? "admin123";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email dan password wajib diisi" },
      { status: 400 }
    );
  }

  if (email !== mockEmail || password !== mockPassword) {
    return NextResponse.json(
      { error: "Email atau password salah" },
      { status: 401 }
    );
  }

  // Buat JWT dengan format yang sama seperti NextAuth v5
  const secret = process.env.NEXTAUTH_SECRET ?? "corehr-dev-secret-change-in-production-1234567890";
  const salt = "authjs.session-token";

  const token = await encode({
    token: {
      sub: "mock-admin-1",
      id: "mock-admin-1",
      name: "Mock Admin",
      email: mockEmail,
      picture: null,
      role: "admin",
      status: "verified",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    },
    secret,
    salt,
    maxAge: 30 * 24 * 60 * 60,
  });

  const response = NextResponse.json({ success: true });

  // Set session cookie dengan format NextAuth v5
  response.cookies.set("authjs.session-token", token, {
    httpOnly: true,
    secure: false, // false untuk development HTTP
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}

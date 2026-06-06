import { proxyAuth } from "@/lib/auth-proxy";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

const PUBLIC_ROUTES = ["/login"];

// Next.js 16+: using "proxy" convention instead of "middleware"
export const proxy = proxyAuth((req: NextAuthRequest) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const userStatus = session?.user?.status as string | undefined;

  // Redirect root to appropriate page
  if (pathname === "/") {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userStatus === "verified" || userStatus === "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/waiting-verification", req.url));
  }

  // Already logged in and trying to access login page
  if (PUBLIC_ROUTES.includes(pathname) && isLoggedIn) {
    if (userStatus === "unverified") {
      return NextResponse.redirect(new URL("/waiting-verification", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Waiting verification page — must be logged in (unverified)
  if (pathname === "/waiting-verification") {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userStatus !== "unverified") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes — must be logged in and verified
  if (!PUBLIC_ROUTES.includes(pathname)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userStatus === "unverified") {
      return NextResponse.redirect(new URL("/waiting-verification", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|api/dev|_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js|workbox-.*).*)",
  ],
};

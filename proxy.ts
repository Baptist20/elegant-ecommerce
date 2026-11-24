import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/admin",
  "/user-dashboard",
  "/checkout",
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

const authMiddleware = withAuth(
  async function handleAuthorized(req: NextRequest) {
    const { getPermission } = getKindeServerSession();
    const permission = await getPermission("is-admin");

    // 1. Logic for the /dashboard middle-ground
    if (req.nextUrl.pathname === "/dashboard") {
      // Redirect at the server level - no flashes!
      if (permission?.isGranted) {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else {
        return NextResponse.redirect(new URL("/user-dashboard", req.url));
      }
    }

    // 2. Protect /admin routes from non-admins
    if (
      req.nextUrl.pathname === "/admin" ||
      req.nextUrl.pathname.startsWith("/admin/")
    ) {
      if (!permission?.isGranted) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    isReturnToCurrentPage: true,
  },
);

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Never intercept Kinde auth API routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Never intercept Next.js prefetch requests so unauthenticated prefetches
  // cannot trigger /api/auth/login and overwrite the Kinde state cookie
  const isPrefetch =
    req.headers.get("next-router-prefetch") !== null ||
    req.headers.get("purpose") === "prefetch";
  if (isPrefetch) {
    return NextResponse.next();
  }

  // Only protect routes that actually exist and require authentication
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  return (authMiddleware as (req: NextRequest) => Promise<NextResponse>)(req);
}

export const config = {
  matcher: [
    "/dashboard",
    "/admin",
    "/admin/:path*",
    "/user-dashboard",
    "/user-dashboard/:path*",
    "/checkout",
    "/checkout/:path*",
  ],
};

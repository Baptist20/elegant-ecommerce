import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  async function proxy(req: NextRequest) {
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
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!permission?.isGranted) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    isReturnToCurrentPage: true,
    publicPaths: [
      "/",
      "/contact",
      "/blog",
      "/about",
      "/shop",
      "/api/auth",
      "/api/products",
      "/api/blogs",
      "/api/blogs/*",
      "/api/wishlist",
      "/api/newsletter",
    ],
  },
);

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)$).*)",
  ],
};

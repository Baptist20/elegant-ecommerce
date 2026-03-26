import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { token } = req.kindeAuth;

    // Admin logic: Redirect non-admins away from /admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const roles = token?.roles || [];
      const isAdmin = roles.includes("admin");

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    isReturnToCurrentPage: true,
    // Kinde will automatically allow access to these without a login
    publicPaths: ["/", "/contact", "/about", "/shop", "/api/auth"],
  },
);

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

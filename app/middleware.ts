import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { token } = req.kindeAuth;

    if (req.nextUrl.pathname.startsWith("/admin")) {
      const roles = token.roles || [];
      const isAdmin = roles.includes("admin");

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    isReturnToCurrentPage: true,
    publicPaths: ["/", "/contact", "/blog", "/about", "/shop"],
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

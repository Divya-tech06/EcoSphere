import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Allow auth-related endpoints and static files
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  const userRole = token.role as string;

  // Settings module is Admin-only
  if (pathname.startsWith("/settings") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};

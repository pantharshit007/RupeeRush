// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher

import { auth } from "./auth";
import { NextMiddleware, NextResponse } from "next/server";

export default auth(function middleware(request: any) {
  const isAuthenticated = !!request.auth;
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

  // Redirect if they are authenticated but still on auth page
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect if they are NOT authenticated and trying to access protected route
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}) as NextMiddleware;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

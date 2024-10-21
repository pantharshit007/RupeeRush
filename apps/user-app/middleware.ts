import NextAuth from "next-auth";
import { NextMiddleware, NextResponse } from "next/server";

import authConfig from "@/auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_REDIRECT,
  publicRoutes,
} from "@/utils/apiRoute";

// Do give a read (as i haven't & that cause me too much pain): https://authjs.dev/guides/edge-compatibility
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  console.log("> route: " + req.nextUrl.pathname);
  console.log("> Logged : " + isLoggedIn);

  // API Auth routes - allow through
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Auth routes - redirect to /settings if logged in
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // Protected routes - redirect to login if not logged in
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
  }

  return NextResponse.next();

  // for type error used as NextMiddleware
}) as NextMiddleware;

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};

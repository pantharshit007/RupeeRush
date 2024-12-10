import NextAuth from "next-auth";
import { NextMiddleware, NextResponse } from "next/server";

import authConfig from "@/auth.config";
import { auth as authSession } from "@/lib/auth";
import {
  apiAuthPrefix,
  authRoutes,
  CREATE_BANK_ACCOUNT,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_REDIRECT,
  publicRoutes,
} from "@/utils/apiRoute";

// Do give a read (as i haven't & that cause me too much pain): https://authjs.dev/guides/edge-compatibility
const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const session = await authSession();

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAccountHolder = session?.user?.phoneNumber;

  console.log("--------------------------------------------------");
  console.log("> route: " + req.nextUrl.pathname);
  console.log("> Logged : " + isLoggedIn);
  console.log("--------------------------------------------------");

  // API Auth routes - allow through
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Auth routes - redirect to /profile if logged in
  if (isAuthRoute) {
    if (isLoggedIn) {
      if (!isAccountHolder) {
        return Response.redirect(new URL(CREATE_BANK_ACCOUNT, nextUrl));
      } else {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
    }
    return NextResponse.next();
  }

  // Protected routes - redirect to login if not logged in
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encoudedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`${DEFAULT_REDIRECT}?callbackUrl=${encoudedCallbackUrl}`, nextUrl)
    );
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

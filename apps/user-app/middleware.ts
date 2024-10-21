import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextMiddleware } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  console.log("> route: " + req.nextUrl.pathname);
  console.log("> Logged : " + isLoggedIn);

  // for type error used as NextMiddleware
}) as NextMiddleware;

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     */

    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};

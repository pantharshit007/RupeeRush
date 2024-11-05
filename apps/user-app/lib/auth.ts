import db, { PrismaAdapter } from "@repo/db/client";
import NextAuth, { NextAuthConfig, NextAuthResult } from "next-auth";

import authConfig from "@/auth.config";
// import { getTwoFactorConfirmationByUserId } from "@/utils/tokenFetch";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

/*
 * Normally, this is is usually created like this
 * @export { { handlers: { GET, POST }, auth,} = NextAuth({ providers: [GitHub], });}
 *
 * But because I am using an adapter, ie. the prisma adapter,
 * I have to create a separate auth configuration file which I can import in the middleware
 *
 * You can refer to the nextAuth v5 documentation
 *
 * - [Adapters and Edge compatibility](https://authjs.dev/guides/upgrade-to-v5?authentication-method=server-component#edge-compatibility)
 */

const authOptions: NextAuthConfig = {
  //! TODO: do we not need the secret now?
  secret: NEXTAUTH_SECRET || "secret",

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (!token.sub) return token;

      /*
       * Caches user-specific properties in the `token` object to enable session management in NextAuth.
       *
       * - If `user` is present (indicating the first sign-in), it assigns properties directly from `user`.
       * - If `user` is undefined (for subsequent requests), token properties persist user data across calls.
       *
       * Properties assigned to `token`:
       * - `token.email`: User’s email address
       * - `token.name`: User’s display name
       * - `token.role`: User’s role (e.g., USER, ADMIN)
       *
       * TS doesn't recognizes role, twoFactorAuth, isOAuth for that we create separate type definition `/@types/next-auth.ts`
       */

      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }

      return token;
    },

    async session({ token, session }: any) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },

    async signIn({ account, user }) {
      // Allow OAuth signin's without email verification
      if (account?.provider !== "credentials") return true;

      /*
       * This checks for an `existingUser` via the user provider, before checking if the user is emailVerified
       * If the user is not verified, they are denied access through the middleware
       * This provides an extra layer security, as we have already do the same on the frontend part `/action/login.ts`
       */

      if (!user || !user.emailVerified) return false;

      /*
       * This check verifies if the user has enabled two-factor authentication (2FA).
       * If 2FA is enabled, we retrieve the confirmation status. If the status is false,
       * it means the user hasn't completed the 2FA process, and access is denied.
       * Only users who pass 2FA verification can proceed with sign-in.
       * Finally, we update the 2FA confirmation status to false for future logins.
       */

      if (user.isTwoFactorEnabled) {
        if (!user.isTwoFactorConfirmation) return false;
        /*
         * const twoFactorStatus = await getTwoFactorConfirmationByUserId(user.id!);
         * if (!twoFactorStatus?.isTwoFactorConfirmation) return false;
         */

        // update the `twoFactorConfirmation` to false for next sign-in
        await db.user.update({
          where: { id: user.id },
          data: { isTwoFactorConfirmation: false },
        });
      }

      return true;
    },
  },

  adapter: PrismaAdapter(db),

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 3, // 3 hr
  },
  ...authConfig,
};

const nextAuth = NextAuth(authOptions);

// need to do that coz of: https://github.com/nextauthjs/next-auth/issues/10568
export const auth: NextAuthResult["auth"] = nextAuth.auth;
export const {
  handlers: { GET, POST },
  signIn,
  signOut,
} = nextAuth;

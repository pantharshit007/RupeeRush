import db from "@repo/db/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig, NextAuthResult } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import type { Session } from "next-auth";

import authConfig from "@/auth.config";
import { CustomToken } from "@/@types/authTypes";
import { getUserById } from "@/utils/userFetch";
// import { getTwoFactorConfirmationByUserId } from "@/utils/tokenFetch";

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
    async jwt({ token, user, trigger, session, profile }) {
      if (!token.sub) return token;

      /*
       * Caches user-specific properties in the `token` object to enable session management in NextAuth.
       *
       * - If `user` is present (indicating the first sign-in), it assigns properties directly from `user`.
       * - If `user` is undefined (for subsequent requests), token properties persist user data across calls.
       *
       * Properties assigned to `token`:
       * - `token.role`: User’s role (e.g., USER, ADMIN)
       * - `token.isTwoFactorEnabled` : Two factor status
       *
       * TS doesn't recognizes role, twoFactorEnabled, isOAuth for that we create separate type definition `/@types/next-auth.ts`
       */

      // First sign in - set initial token data
      if (user) {
        const existingUser = await getUserById(token.sub); //had to call coz of OAuth
        if (existingUser) {
          token.name = existingUser.name || user.name;
          token.email = existingUser.email || user.email;
          token.role = existingUser.role || user.role;
          token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled || user.isTwoFactorEnabled;
          token.isOAuth = !!profile;
          token.phoneNumber = existingUser?.phoneNumber || user?.phoneNumber;
          token.lastUpdate = Date.now();
        }
      }

      // Handle update trigger: force session revalvate
      if (trigger === "update" && session?.user) {
        // 1st way: using the values passed inside session
        token.name = session.user.name;
        token.email = session.user.email;
        token.phoneNumber = session.user.phoneNumber;
        token.isTwoFactorEnabled = session.user.isTwoFactorEnabled;
        token.lastUpdated = Date.now();

        // 2nd way: Only fetch from DB when explicitly updating
        /*
         * const updatedUser = await getUserById(token.sub);
         * if (updatedUser) {
         *   token.email = updatedUser.email;
         *   token.name = updatedUser.name;
         *   token.role = updatedUser.role;
         *   token.isTwoFactorEnabled = updatedUser.isTwoFactorEnabled;
         *   token.lastUpdate = Date.now();
         * }
         */
      }

      return token;
    },

    // before adding new properties to session update `next-auth.d.ts`
    // @ts-ignore
    async session({ token, session }: { token: CustomToken; session: Session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.lastUpdate = token.lastUpdate;
      }

      if (token.phoneNumber && session.user) {
        session.user.phoneNumber = token.phoneNumber;
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
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 3, // 3 hr
  },
  ...authConfig,
};

const nextAuth = NextAuth(authOptions);

// need to do that coz of: https://github.com/nextauthjs/next-auth/issues/10568
export const auth: NextAuthResult["auth"] = nextAuth.auth;
export const signIn: NextAuthResult["signIn"] = nextAuth.signIn;
export const {
  handlers: { GET, POST },
  // signIn, // giving stupid error after just a simple re-install of node_modules
  signOut,
  unstable_update,
} = nextAuth;

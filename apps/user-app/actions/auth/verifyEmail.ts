"use server";

import { getVerificationTokenByToken } from "@/utils/tokenFetch";
import { getUserByEmail } from "@/utils/userFetch";
import db from "@repo/db/client";

/**
 * This function is used to check whether the token is expired, and also used to **register** the user in db.
 * It update the user **emailVerified** with the newDate of when it has been verified
 * @param token is recieved from the verification token in the TokenVerification form
 * @param existingUser is used to identify if user is already registered with us or not
 * @returns
 */

export const emailVerifyAction = async (token: string, existingUser: boolean) => {
  const verificationToken = await getVerificationTokenByToken(token);
  if (!verificationToken) {
    return { error: "Token does not exist!" };
  }

  // check for is Token expired or not?: expires < current
  const hasExpired = new Date(verificationToken.expires) < new Date();
  if (hasExpired) {
    await db.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { error: "Token has expired" };
  }

  // NOTE: no 3rd party can use another person's token since we will be deleting it after verification
  // for case where user created but token is not deleted we can use transactions,
  try {
    // create a new verified user in db
    if (!existingUser) {
      await db.user.create({
        data: {
          name: verificationToken.name,
          email: verificationToken.email,
          password: verificationToken.hashedPassword,
          emailVerified: new Date(),
        },
      });

      // update the user detail: email and emailVerified
    } else {
      const registeredUser = await getUserByEmail(verificationToken.email);
      if (!registeredUser) {
        return { error: "User Email does not exist" };
      }

      await db.user.update({
        where: { id: registeredUser.id },
        data: {
          emailVerified: new Date(),
          email: registeredUser.email, // when we update user's email
        },
      });
    }

    // Clean up any other expired tokens while we're at it
    await db.verificationToken.deleteMany({
      where: {
        expires: { lt: new Date() },
      },
    });

    return { success: "Email Verified!" };
  } catch (err: any) {
    console.error("> Email verification failed: " + err || "already have an account?");
    return { error: "Failed to Verify!" };
  } finally {
    // clean up the verification token
    await db.verificationToken.delete({
      where: { id: verificationToken.id },
    });
  }
};

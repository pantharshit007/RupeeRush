import db from "@repo/db/client";

/**
 * Function will fetch an entity of the existing data using the email passed
 * @param email
 * @returns {getTokenByEmail} the returned value contains an object of:
 * @type {id: string; email: string; token: string; expires: Date;}
 */
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const getTokenByEmail = await db.verificationToken.findFirst({
      where: { email },
    });

    return getTokenByEmail;
  } catch (err) {
    return null;
  }
};

/**
 * Function will fetch an entity of the existing data in the using the token passed
 * @param token
 * @returns {getTokenByToken} the returned value contains an object of:
 * @type {id: string; email: string; token: string; expires: Date;}
 */

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const getTokenByToken = await db.verificationToken.findUnique({
      where: { token },
    });

    return getTokenByToken;
  } catch (err) {
    return null;
  }
};

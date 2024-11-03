import db from "@repo/db/client";

interface getTokenByEmail {
  id: string;
  email: string;
  name: string;
  hashedPassword: string;
  token: string;
  expires: Date;
}

/**
 * Function will fetch an entity of the existing data using the email passed (email verification)
 * @param email
 * @returns {getTokenByEmail} the returned value contains an object of:
 * @tstype {id: string; email: string; token: string; expires: Date; name: string; hashedPassword: string;}
 */
export const getVerificationTokenByEmail = async (
  email: string
): Promise<getTokenByEmail | null> => {
  try {
    const getTokenByEmail = await db.verificationToken.findFirst({
      where: { email },
    });

    return getTokenByEmail;
  } catch (err) {
    return null;
  }
};

interface getTokenByToken {
  id: string;
  email: string;
  name: string;
  hashedPassword: string;
  token: string;
  expires: Date;
}

/**
 * Function will fetch an entity of the existing data in the using the token passed (email verification)
 * @param token
 * @returns {getTokenByToken} the returned value contains an object of:
 * @tstype {id: string; email: string; token: string; expires: Date; name: string; hashedPassword: string;}
 */

export const getVerificationTokenByToken = async (
  token: string
): Promise<getTokenByToken | null> => {
  try {
    const getTokenByToken = await db.verificationToken.findUnique({
      where: { token },
    });

    return getTokenByToken;
  } catch (err) {
    return null;
  }
};

/**
 * return the data of first related email from table **passwordResetToken**
 *
 * @param email
 */

export const getResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email: email },
    });

    return passwordResetToken;
  } catch (err) {
    return null;
  }
};

/**
 * return the data of unique token from table **passwordResetToken**
 *
 * @param token
 */

export const getResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch (err) {
    return null;
  }
};

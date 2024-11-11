import db from "@repo/db/client";

interface getTokenByEmail {
  id: string;
  email: string;
  name: string | null;
  hashedPassword: string | null;
  token: string;
  expires: Date;
  updateEmailId: string | null;
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
  name: string | null;
  hashedPassword: string | null;
  token: string;
  expires: Date;
  updateEmailId: string | null;
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

/* ----------------------------------------------------------------------------------------------------*/

/**
 * return the data of first related email from table **PasswordResetToken**
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
 * return the data of unique token from table **PasswordResetToken**
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

/* ----------------------------------------------------------------------------------------------------*/

/**
 * return the data of first related email from table `TwoFactorCode`
 *
 * @param email
 */

export const getTwoFactorCodeByEmail = async (email: string) => {
  try {
    const twoFactorCode = await db.twoFactorCode.findFirst({
      where: { email: email },
    });

    return twoFactorCode;
  } catch (err) {
    return null;
  }
};

/**
 * return the data of unique token from table `TwoFactorCode`
 *
 * @param token
 */

export const getTwoFactorCodByCode = async (code: string) => {
  try {
    const twoFactorCode = await db.twoFactorCode.findUnique({
      where: { code },
    });

    return twoFactorCode;
  } catch (err) {
    return null;
  }
};

/* ----------------------------------------------------------------------------------------------------*/

/**
 * return the optional data **isTwoFactorConfirmation** from `User` table
 *
 * @param userId
 * @returns `id: string`; `isTwoFactorConfirmation: boolean | null`;
 */

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmationId = await db.user.findUnique({
      where: { id: userId },
      select: { isTwoFactorConfirmation: true, id: true },
    });

    return twoFactorConfirmationId;
  } catch (err) {
    return null;
  }
};

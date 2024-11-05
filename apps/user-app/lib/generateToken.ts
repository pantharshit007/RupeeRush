import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

import db from "@repo/db/client";
import {
  getVerificationTokenByEmail,
  getResetTokenByEmail,
  getTwoFactorCodeByEmail,
} from "@/utils/tokenFetch";

interface RegistrationData {
  email: string;
  name?: string;
  hashedPassword?: string;
}
/**
 * Generate Vertification token
 * @param email user's email
 * @param name user's name
 * @param hashedPassword user's hashed password
 */

export const generateVerificationToken = async ({
  email,
  name,
  hashedPassword,
}: RegistrationData) => {
  /**
   * Generating a unique uuid for token
   *  @function uuid()
   * @type {string}
   */
  const token: string = uuidv4();

  /**
   * Get the current date and time and Add 15 minutes to the current time
   * @const  const expiryTime = currentDate.setMinutes(currentDate.getMinutes() + 15);
   */
  const expiryTime = new Date(new Date().getTime() + 60 * 15 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const createVerificationToken = await db.verificationToken.create({
    data: {
      email,
      name: name || "",
      hashedPassword: hashedPassword || "",
      token,
      expires: expiryTime,
    },
  });

  return createVerificationToken;
};

/* ----------------------------------------------------------------------------------------------------*/

/**
 * Generate Password reset token
 * @param email
 */

export const generateResetToken = async (email: string) => {
  const token: string = uuidv4();

  /**
   * Get the current date and time and Add 15 minutes to the current time
   * @const  const expiryTime = currentDate.setMinutes(currentDate.getMinutes() + 15);
   */
  const expiryTime = new Date(new Date().getTime() + 60 * 15 * 1000);

  const existingToken = await getResetTokenByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const newResetToken = await db.passwordResetToken.create({
    data: {
      email,
      expires: expiryTime,
      token,
    },
  });

  return newResetToken;
};

/* ----------------------------------------------------------------------------------------------------*/

/**
 * functions generates a 2FA code with expiry of 15 minutes
 *
 * @param email
 */

export const generateTwoFACode = async (email: string) => {
  const code: string = crypto.randomInt(1_00_000, 10_00_000).toString(); // 1lakh - 10lakh

  /**
   * Get the current date and time and Add 5 minutes to the current time
   * @const  const expiryTime = currentDate.setMinutes(currentDate.getMinutes() + 5);
   */
  const expiryTime = new Date(new Date().getTime() + 60 * 5 * 1000);

  // delete existing code
  const expiryCode = await getTwoFactorCodeByEmail(email);
  if (expiryCode) {
    await db.twoFactorCode.delete({
      where: { id: expiryCode.id },
    });
  }

  const twoFactorCode = await db.twoFactorCode.create({
    data: {
      email,
      code,
      expires: expiryTime,
    },
  });

  return twoFactorCode;
};

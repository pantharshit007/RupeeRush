import { getVerificationTokenByEmail } from "@/utils/tokenFetch";
import db from "@repo/db/client";
import { v4 as uuidv4 } from "uuid";

interface RegistrationData {
  email: string;
  name: string;
  hashedPassword: string;
}
/**
 *  Generate Vertification token
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
   * Get the current date and time and Add 5 minutes to the current time
   * @const  const expiryTime = currentDate.setMinutes(currentDate.getMinutes() + 5);
   */
  const expiryTime = new Date(new Date().getTime() + 60 * 5 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const createVerificationToken = await db.verificationToken.create({
    data: {
      email,
      name,
      hashedPassword,
      token,
      expires: expiryTime,
    },
  });

  return createVerificationToken;
};

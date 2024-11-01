import { getVerificationTokenByEmail } from "@/utils/tokenFetch";
import db from "@repo/db/client";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  /**
   * Generating a unique uuid for token
   *  @function uuid()
   * @type {string}
   */
  const token: string = uuidv4();

  /**
   * Get the current date and time and Add 1 hour to the current time
   * @const  const expiryTime = currentDate.setHours(currentDate.getHours() + 1);
   */
  const expiryTime = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const createVerificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires: expiryTime,
    },
  });

  return createVerificationToken;
};

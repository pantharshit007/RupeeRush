import { Resend } from "resend";

import { emailVerificationTemplate } from "@/mail/email.VerifcationTemp";

const resend = new Resend(process.env.RESEND_API_KEY);
const prodUrl = process.env.AUTH_PUBLIC_URL;
const devUrl = process.env.AUTH_DEV_URL;

const domain = prodUrl || devUrl || "http://localhost:3000";

/**
 * This function is used to send verification email to the user signing in
 *
 * @param email gets the user registering email
 * @param token the token is the verificationToken sent by the user
 */

export const sendVerificationEmail = async (email: string, token: string) => {
  /**
   * This is the confirmation link which will be sent to the user.
   * This link will create a new verification page, which will be used to check
   *
   * @token expiration, and whether it exists and change the users email
   */
  const confirmationLink = `${domain}/auth/new-verification?token=${token}`;
  const body = emailVerificationTemplate(confirmationLink);

  await resend.emails.send({
    from: "Jethiya007 <verification@resend.dev>",
    to: email,
    subject: "Verification Email: RupeeRush",
    html: body,
  });
};

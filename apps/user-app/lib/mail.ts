import { Resend } from "resend";

import { emailVerificationTemplate } from "@/mail/email.VerifcationTemp";
import { emailPasswordResetTemplate } from "@/mail/email.PassResetTemp";
import { emailTwoFACodeTemplate } from "@/mail/email.TwoFactorCode";

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
  const confirmationLink = `${domain}/auth/verification?token=${token}`;
  const body = emailVerificationTemplate(confirmationLink);

  await resend.emails.send({
    from: "Jethiya007 <verification@rupeerush.pantharshit007.tech>",
    to: email,
    subject: "Email verification: RupeeRush",
    html: body,
  });
};

/* ----------------------------------------------------------------------------------------------------*/

/**
 * This function will be used to send password reset link via email to the user.
 * @param email
 * @param token
 */

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}/auth/new-password?token=${token}`;
  const body = emailPasswordResetTemplate(confirmationLink);

  await resend.emails.send({
    from: "Jethiya007 <infoupdate@rupeerush.pantharshit007.tech>",
    to: email,
    subject: "Password Reset: RupeeRush",
    html: body,
  });
};

/* ----------------------------------------------------------------------------------------------------*/

/**
 * This function will be used to send 2FA code via email to the user.
 * @param email
 * @param code
 */

export const sendTwoFactorCode = async (email: string, code: string) => {
  const body = emailTwoFACodeTemplate(code);

  await resend.emails.send({
    from: "Jethiya007 <accountUpdate@rupeerush.pantharshit007.tech>",
    to: email,
    subject: "Two Factor code: RupeeRush",
    html: body,
  });
};

export const emailVerificationTemplate = (confirmationLink: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to RupeeRush - Email Verification</title>
</head>
<body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="min-width: 100%; background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 40px 40px 20px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <img src="https://i.ibb.co/p1JNcng/rupeerush-logo.jpg" alt="RupeeRush Logo" width="100" style="max-width: 100px; height: auto;" />
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 30px;">
                                        <h1 style="color: #333333; font-size: 28px; margin: 0;">Welcome to RupeeRush</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 20px;">
                                        <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0;">Thank you for joining RupeeRush! 
                                          </br>
                                          Please confirm your email address to get started.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 30px;">
                                        <a href=${confirmationLink} style="background-color: #00ff80; color: #000000; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold; display: inline-block;">Confirm Your Email</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 20px;">
                                        <p style="color: #999999; font-size: 14px; line-height: 21px; margin: 0;">Or copy and paste this link into your browser:</p>
                                        <p style="color: #666666; font-size: 14px; line-height: 21px; margin: 10px 0 0;">${confirmationLink}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>  `;
};

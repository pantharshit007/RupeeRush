
export const emailTwoFACodeTemplate = (code: string) => {

    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Two Factor code: Email</title>
    </head>
    <body>
        <div style="font-family: Helvetica, Arial, sans-serif; min-width: 100%; overflow: auto; line-height: 2">
            <div style="margin: 50px; width: 80%; padding: 20px 0">
                <div style="border-bottom: 1px solid #eee">
                    <a href="https://rupeerush.vercel.app" style="color: #00466a; text-decoration: none; font-weight: 600">
                        <img style="max-width: 200px; border-radius: 9999px;" src="https://i.ibb.co/p1JNcng/rupeerush-logo.jpg" alt="RupeeRush Logo"/>
                    </a>
                </div>
                <p style="font-size: 1.1em">Hi,</p>
                <p>Thank you for choosing Us. Use the following CODE to complete your two Factor Authentication (2FA). This CODE is valid for 5 minutes</p>
                <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">
                    ${code}
                </h2>
                <p style="font-size: 0.9em;">Regards,<br />RupeeRush</p>
                <hr style="border: none; border-top: 1px solid #eee" />
                <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300">
                    <p>RupeeRush Inc</p>
                    <p>India</p>
                </div>
            </div>
        </div>
    </body>
    </html>`;
};

export const emailVerificationTemplate = (confirmationLink: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />

        <title>Email Verification: Email</title>
        <style>
        /* Styles for the email */
        body {
            font-family: "Poppins", sans-serif;
            font-weight: 400;
            font-style: normal;
            background-color: #242424;
            color: white;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 8px;
        }
        h1 {
            text-align: center;
        }
        p {
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column; /* Stack elements vertically */
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #00ff80;
            color: black;
            text-decoration: none;
            border-radius: 5px;
            margin-bottom: 10px; /* Add spacing below the button */
        }
        </style>
    </head>
    <body>
        <div class="container">
        <h1>Welcome to RupeeRush</h1>
        <p>Please confirm your email by clicking here!</p>
        <div class="block">
            <a class="button" href="${confirmationLink}">Confirm your email</a>
            <p>or copy and paste this link into your browser:</p>
            <p>${confirmationLink}</p>
        </div>
        </div>
    </body>
    </html>
  `;
};

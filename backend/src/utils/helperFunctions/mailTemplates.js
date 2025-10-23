const accountVerificationOTP = `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f9fc;
        margin: 0;
        padding: 0;
      }
      .container {
        background-color: #ffffff;
        max-width: 600px;
        margin: 40px auto;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #4a90e2;
        color: #ffffff;
        text-align: center;
        padding: 30px 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 30px 20px;
        color: #333333;
        line-height: 1.6;
      }
      .content h2 {
        font-size: 20px;
        margin-top: 0;
      }
      .button {
        display: inline-block;
        background-color: #4a90e2;
        color: #ffffff;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        margin: 20px 0;
        font-weight: bold;
      }
      .footer {
        background-color: #f1f1f1;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #777777;
      }
      @media (max-width: 600px) {
        .content,
        .header {
          padding: 20px 15px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Verify Your Email Address</h1>
      </div>
      <div class="content">
        <h2>Hello username,</h2>
        <p>
          Thank you for signing up! To complete your registration, please verify
          your email.
        </p>

        <p>Your OTP is</p>
        <p><b>{otp}</b></p>

        <p>
          If you did not create an account, you can safely ignore this email.
        </p>
        <p>Thank you,<br />Learnify AI</p>
      </div>
      <div class="footer">&copy; 2025 Learnify. All rights reserved.</div>
    </div>
  </body>
</html>
`;

export { accountVerificationOTP };

const accountVerificationOTP = `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #f5f7fb;
        font-family: "Inter", Arial, sans-serif;
        color: #1a1a1a;
      }

      .container {
        max-width: 550px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
      }

      .header {
        background: linear-gradient(135deg, #111827, #1f2937);
        text-align: center;
        padding: 45px 25px;
        color: #fff;
      }

      .header h1 {
        margin: 0;
        font-size: 26px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .content {
        padding: 35px 28px;
        line-height: 1.7;
        font-size: 15px;
      }

      .content h2 {
        margin-top: 0;
        font-size: 22px;
        font-weight: 600;
      }

      .otp-box {
        margin: 25px 0;
        padding: 16px 20px;
        background: #f3f6ff;
        border-left: 4px solid #4a90e2;
        border-radius: 8px;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 2px;
        color: #1e3a8a;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .footer {
        text-align: center;
        padding: 18px;
        background: #484849;
        font-size: 15px;
        color: #ffffff;
      }

      @media (max-width: 600px) {
        .content {
          padding: 25px 18px;
        }
        .header {
          padding: 35px 20px;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>Email Verification</h1>
      </div>

      <div class="content">
        <h2>Hello username,</h2>

        <p>
          Welcome aboard! Before we let you in, you just need to verify your
          email.
        </p>

        <div class="otp-box">{otp}</div>

        <p>
          If you didn't sign up for Learnify AI, feel free to ignore this
          message — no hard feelings.
        </p>

        <p>Cheers,<br />Learnify AI</p>
      </div>

      <div class="footer">&copy; 2025 Learnify. All rights reserved.</div>
    </div>
  </body>
</html>

`;

export { accountVerificationOTP };

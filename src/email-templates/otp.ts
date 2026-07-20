import { CONFIGS } from "../config/index.js";

export const otpTemplate = (otp: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${CONFIGS.APP_NAME} — Verify Your Account</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f0f1a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f1a; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a2e; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);">
          <tr>
            <td style="background: linear-gradient(135deg, #8b5cf6, #06b6d4); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; color: #ffffff; letter-spacing: 2px;">
                ${CONFIGS.APP_NAME}
              </h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.8); letter-spacing: 1px; text-transform: uppercase;">
                Account Verification
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 12px; font-size: 22px; color: #ffffff; text-align: center;">
                Your Verification Code
              </h2>
              <p style="margin: 0 0 32px; font-size: 15px; color: #a0a0b8; line-height: 1.6; text-align: center;">
                Use the code below to verify your account. This code is valid for <strong style="color: #ffffff;">5 minutes</strong>.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 20px 48px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15)); border: 2px solid rgba(139, 92, 246, 0.3); border-radius: 16px;">
                      <span style="font-size: 40px; font-weight: 700; color: #ffffff; letter-spacing: 12px; font-family: 'Courier New', monospace;">
                        ${otp}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 14px; color: #6b6b80; text-align: center; line-height: 1.6;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #0f0f1a; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #4a4a5e;">
                This is an automated message. Please do not reply.<br />
                &copy; ${new Date().getFullYear()} ${CONFIGS.APP_NAME}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

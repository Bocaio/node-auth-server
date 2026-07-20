import { CONFIGS } from "../config/index.js";

export const welcomeTemplate = (username: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ${CONFIGS.APP_NAME}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f0f1a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f1a; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a2e; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);">
          <tr>
            <td style="background: linear-gradient(135deg, #e94560, #8b5cf6); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; color: #ffffff; letter-spacing: 2px;">
                ${CONFIGS.APP_NAME}
              </h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.8); letter-spacing: 1px; text-transform: uppercase;">
                Welcome aboard
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; font-size: 24px; color: #ffffff;">
                Hey ${username}! 👋
              </h2>
              <p style="margin: 0 0 24px; font-size: 16px; color: #a0a0b8; line-height: 1.6;">
                Thanks for joining ${CONFIGS.APP_NAME}. Your account is ready — you can now sign in and start exploring.
              </p>
              <p style="margin: 0; font-size: 14px; color: #6b6b80; line-height: 1.6;">
                If you didn't create this account, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #0f0f1a; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #4a4a5e;">
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

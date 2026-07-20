import { transporter } from "../../config/email.js";
import { CONFIGS } from "../../config/index.js";
import { welcomeTemplate } from "../../email-templates/welcome.js";
import { otpTemplate } from "../../email-templates/otp.js";
import { EmailServiceType } from "./type.js";

export class EmailService implements EmailServiceType {
    sendOTP = async (recipientMail: string, otp: string) => {
        await transporter.sendMail({
            from: CONFIGS.SMTP_USER,
            to: recipientMail,
            subject: `${CONFIGS.APP_NAME} — Your Verification Code`,
            text: `Your verification code is: ${otp}. This code is valid for 5 minutes.`,
            html: otpTemplate(otp),
        });
    };

    sendWelcome = async (recipientMail: string, username: string) => {
        await transporter.sendMail({
            from: CONFIGS.SMTP_USER,
            to: recipientMail,
            subject: `Welcome to ${CONFIGS.APP_NAME}`,
            text: `Welcome to ${CONFIGS.APP_NAME}, ${username}!`,
            html: welcomeTemplate(username),
        });
    };
}

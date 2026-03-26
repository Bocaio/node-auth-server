import { transporter } from "../config/email.js";
import { CONFIGS } from "../config/index.js";
import { welcomeTemplate } from "../email-templates/welcome.js";
import { otpTemplate } from "../email-templates/otp.js";

interface EmailServiceType {
    sendOTP: (recipientMail: string, otp: string) => Promise<any>;
    sendWelcome: (recipientMail: string, username: string) => Promise<any>;
}

class EmailService {
    sendOTP = async (recipientMail: string, otp: string) => {
        await transporter.sendMail({
            from: CONFIGS.SMTP_GMAIL,
            to: recipientMail,
            subject: "",
            text: ``,
            html: otpTemplate(otp),
        });
    }
    sendWelcome = async (recipientMail: string, username: string) => {
        await transporter.sendMail({
            from: CONFIGS.SMTP_GMAIL,
            to: recipientMail,
            subject: "",
            text: ``,
            html: welcomeTemplate(username),
        });
    }
}

export { EmailServiceType, EmailService }
import * as nodemailer from "nodemailer";
import { CONFIGS } from "./index.js";

export const transporter = nodemailer.createTransport({
    service: CONFIGS.SMTP_SERVICE,
    auth: {
        user: CONFIGS.SMTP_USER,
        pass: CONFIGS.SMTP_PASSWORD,
    },
});

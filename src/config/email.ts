import * as nodemailer from "nodemailer"
import { CONFIGS } from "./index.js"

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: CONFIGS.SMTP_GMAIL,
        pass: CONFIGS.SMTP_PASSWORD
    }
})
export interface EmailServiceType {
    sendOTP: (recipientMail: string, otp: string) => Promise<any>;
    sendWelcome: (recipientMail: string, username: string) => Promise<any>;
}
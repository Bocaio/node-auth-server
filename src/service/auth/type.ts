export interface Login {
    accessToken: string;
    refreshToken: string;
    user: UserInfo;
}

export interface UserInfo {
    id: string;
    username: string;
    email: string;
}

export interface ForgetPwVerifyOutput {
    token: string;
}

export interface IAuthService {
    register: (username: string, email: string, password: string) => Promise<UserInfo>;
    login: (email: string, password: string) => Promise<Login>;
    googleLogin: (idToken: string) => Promise<Login>;
    refresh: (token: string) => Promise<Login>;
    logout: (token: string) => Promise<void>;
    forgetPwVerify: (email: string, otp: string) => Promise<ForgetPwVerifyOutput>;
    resetPassword: (newPw: string, token: string) => Promise<void>;
    emailOtpGenerate: (email: string) => Promise<string>;
    emailOtpVerify: (email: string, otp: string) => Promise<boolean>;
}

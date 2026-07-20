export const SuccessMessage = {
    SIGNUP_VERIFY_EMAIL: "Please verify your email",
    LOGIN_SUCCESS: "Logged in successfully",
    LOGOUT_SUCCESS: "Logged out successfully",
    OTP_SENT: "OTP sent successfully",
    EMAIL_VERIFIED: "Email verified successfully",
    PASSWORD_CHANGED: "Password changed successfully",
    HEALTH_OK: "Service is healthy",
} as const;

export const ErrorMessage = {
    INTERNAL_ERROR: "Internal Server Error",
    BAD_REQUEST: "Bad Request",
    SERVICE_UNAVAILABLE: "Service temporarily unavailable",
    VALIDATION_FAILED: "Validation failed",
    INPUT_TOO_LONG: "Your input is too long",

    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    INVALID_CREDENTIALS: "Invalid email or password",
    EMAIL_NOT_VERIFIED: "Email not verified",
    EMAIL_ALREADY_VERIFIED: "Email already verified or does not exist",
    TOKEN_NOT_FOUND: "Token not found",
    INVALID_OTP: "Incorrect OTP",

    USER_NOT_FOUND: "User not found",
} as const;

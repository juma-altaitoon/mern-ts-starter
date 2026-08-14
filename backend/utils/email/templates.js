
export const welcomeEmailTemplate = (firstName, verifyLink) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to ${process.env.APP_NAME}, ${firstName}</h2>
        <p>We’re excited to have you on board. Please verify your account by clicking the link below:</p>
        <a href="${verifyLink}" 
          style="display:inline-block; padding:10px 20px; background:#4F46E5; color:#fff; text-decoration:none; border-radius:5px;">
          Verify Account
        </a>
        <p>If you didn’t sign up, you can safely ignore this email.</p>
      </div>
    `
};

export const otpEmailTemplate = (firstName, otpCode) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${firstName},</h2>
        <p>Use the following One-Time Password (OTP) to sign in:</p>
        <h3 style="color:#4F46E5; letter-spacing:2px;">${otpCode}</h3>
        <p>This code will expire in 10 minutes. Do not share it with anyone.</p>
      </div>
    `
};

export const resetPasswordTemplate = (firstName, resetLink) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your password. Click the link below to set a new one:</p>
        <a href="${resetLink}" 
          style="display:inline-block; padding:10px 20px; background:#DC2626; color:#fff; text-decoration:none; border-radius:5px;">
          Reset Password
        </a>
        <p>If you didn’t request this, you can ignore this email.</p>
      </div>
    `
};

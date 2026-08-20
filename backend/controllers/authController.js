import User from '../models/User.js';
import Token from '../models/Token.js';
import logger from '../middleware/logger.js';
import { sendEmail } from '../config/nodemailer.js';
import { 
    welcomeEmailTemplate,
    otpEmailTemplate,
    resetPasswordTemplate,
 } from "../utils/email/templates.js";
import crypto from 'crypto';

// Auth Check
/**
 * Checks if the user is authenticated by verifying the presence of a valid user ID in the request.
 * Requires auth middleware to set req.user (JWT verification).
 * If the user is authenticated, it retrieves the user's details from the database and returns them in the response.
 * If the user is not authenticated or an error occurs, it returns an appropriate error message.
 */
export const authCheck = async (req, res) => {
    const userId = req.user;
    if (!req.user){
        return res.status(401).json({ message: "User is not Logged in"})
    }
    try {
        const user = await User.findById(userId).select([
            "_id",
            "firstName",
            "email",
            "role",
            "avatar",
        ]);
        return res.status(200).json({ message: "User is signed in.", user});
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized access.", error: error.message});
    }
}

// Sign Up
/**
 * Handles user registration by creating a new user in the database.
 * It checks if the email already exists and saves the user.
 * After successful registration, it generates a verification token and sends a welcome email with a verification link.
 */
export const signup = async (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
        country,
        city,
        dateOfBirth,
        avatar,
    } = req.body;
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email }); 
        if (existingUser) {
            logger.error("User already exists.");
            return res.status(400).json({ message: "User already exists." });
        }   
    } catch (error) {
        logger.error("Error checking existing user", error);
        return res.status(500).json({ message: "Server error", error: error });
    }

    const user = new User({
        email,
        password,
        firstName,
        lastName,
        country,
        city,
        dateOfBirth,
        avatar,
    });

    try {
        await user.save();
        logger.info("User sign up successful.");
        
        // Generate verification token
        const { token } = await Token.generateToken(user._id, 'verify_account', 30);
        const verifyLink = `${process.env.FRONTEND_URL}/verify/${token}` ;
        
        // Send Welcome and Verify email
        const welcomeEmail = welcomeEmailTemplate(user.firstName, verifyLink);
        const subject = `Welcome to ${process.env.APP_NAME} - Verify Your Account`;
        await sendEmail(user.email, subject, welcomeEmail);

        return res.status(201).json({ message: "User registered successfully. Check your email to verify your account." });
    } catch (error) {
        logger.error("Sign up error", error);
        return res.status(500).json({ message: "Sign up error", error: error.message });
    }
};

// Verify Account
/**
 * Verifies the user's account using a token sent via email.
 * It checks if the token is valid and not expired, retrieves the associated user, and updates their status to "active".
 * If the verification is successful, it removes the token from the database and returns a success message.
 * If the token is invalid or expired, or if any error occurs, it returns an appropriate error message.
 */
export const verifyAccount = async (req, res) => {
    try {
        const verifyToken = req.params.token;
        const storedToken = await Token.verifyToken("verify_account", verifyToken);
        if (!storedToken) {
            return res.status(400).json({ message: "Invalid token", error: "Invalid or expired token" });
        }
        const user = await User.findById(storedToken.userId);
        if (!user) {
            return res.status(400).json({ message: "Invalid token", error: "Invalid or expired token" });
        }
        
        user.status = "active";
        await user.save();
        await Token.removeToken(storedToken.userId, storedToken.type)
        
        logger.info(`Account verified - <${user.email}>`);
        return res.status(200).json({ message: "Account verified." });
    } catch (error) {
        logger.error("Account verification error", error);
        return res.status(500).json({ message: "Account verification failed", error: error.message });        
    }
};

// Sign In
/**
 * Handles user sign-in by verifying the provided email and password.
 * If the credentials are valid, it generates a JSON Web Token (JWT) and sets it in an HTTP-only cookie.
 * Cookie expiry is 1 hour in code.
 * The response includes a success message and the user's ID.
 * If the credentials are invalid or any error occurs, it returns an appropriate error message.
 */
export const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        logger.error("Email and password are required.");
        return res.status(400).json({ message: "All fields are required."});
    }

    try {
        const user = await User.findOne({ email });
        if (!user || ! await user.matchPassword(password)) {
            logger.info("Invalid user credentials.");
            return res.status(401).json({ message: "Invalid user credentials." });
        }

        const token = user.generateJWT();

        // Save JWT in a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
            maxAge: 1000 * 60 * 60,
        });
        logger.info(`Sign in successful for user: ${user._id}`);
        return res.status(200).json({ message: "Sign in Successful", user: user._id });

    } catch (error) {
        logger.error("Sign in error", error.message);
        return res.status(500).json({ message: "Sign in error"});
    }
};

// Sign In with OTP
/**
 * Handles user sign-in using a One-Time Password (OTP) sent to the user's email.
 * It generates an OTP token, sends it via email, and returns a success message with a cooldown period.
 * If the email is not provided or the user does not exist, it returns an appropriate error message.
 * Any errors during the process are logged and returned in the response.
 */
export const  signinWithOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        logger.error("Email is required.");
        return res.status(400).json({ message: "Email is required."});
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.error(`Invalid user credential: ${email}`);
            return res.status(401).json({ message: "Invalid user credentials." });
        }
        // Generate otp code/token and remove any existing active OTPs.
        const { token } = await Token.generateToken(user._id, "otp", 10);

        const otpEmail = otpEmailTemplate(user.firstName, token);
        const subject = `${process.env.APP_NAME} - OTP Code`;
        await sendEmail(user.email, subject, otpEmail);

        logger.info(`OTP Sent to: ${email}`);
        return res.status(200).json({
            message: "OTP Code sent. Please check your Inbox",
            cooldown: 30,
        });
    } catch (error) {
        logger.error(`Sign In error: ${email}`);
        return res.status(500).json({ message: "Sign in error", error: error.message });
    }
};

// Resend OTP
/**
 * Handles the resending of a One-Time Password (OTP) to the user's email.
 * It checks if the email is provided and if the user exists, then generates a new OTP token and sends it via email.
 * The response includes a success message and a cooldown period.
 * If the email is not provided or the user does not exist, it returns an appropriate error message.
 * Any errors during the process are logged and returned in the response.
 */
export const resendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        logger.error("Email is required for OTP resend.");
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.error(`Invalid user credential for resend: ${email}`);
            return res.status(401).json({ message: "Invalid user credentials." });
        }

        // Reissue a fresh OTP token. Existing OTP tokens for the same user and type are removed in generateToken.
        const { token } = await Token.generateToken(user._id, "otp", 10);

        const otpEmail = otpEmailTemplate(user.firstName, token);
        const subject = `${process.env.APP_NAME} - OTP Code Resend`;
        await sendEmail(user.email, subject, otpEmail);

        logger.info(`OTP Resent to: ${email}`);
        return res.status(200).json({
            message: "OTP code resent. Please check your Inbox.",
            cooldown: 30,
        });
    } catch (error) {
        logger.error(`OTP resend error: ${email}`, error);
        return res.status(500).json({ message: "OTP resend error", error: error.message });
    }
};

// Verify OTP
/**
 * Verifies the One-Time Password (OTP) provided by the user for authentication.
 * It checks if the email and OTP are provided, retrieves the user and the stored OTP token, and validates them.
 * If the OTP is valid and matches the user, it removes the OTP token, generates a JWT, and sets it in an HTTP-only cookie.
 * The response includes a success message and the user's ID.
 * If the OTP is invalid, expired, or any error occurs, it returns an appropriate error message.
 */
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        logger.warning("Missing email or OTP");
        return res.status(400).json({ message: "Email and OTP fields are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid user credentials." });
        }

        const otpDoc = await Token.verifyToken("otp", otp);
        if(!otpDoc || !otpDoc.userId.equals(user._id)) {
            return res.status(401).json({ message: "Invalid or expired OTP." });
        }

        await Token.removeToken(user._id, otpDoc.type);
        // Generate JWT
        const token = user.generateJWT();
        // Save JWT in a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
            maxAge: 1000 * 60 * 60,
        });
        
        user.lastLogin = Date.now();
        await user.save();

        logger.info(`Sign in successful for user: ${user._id}`);
        return res.status(200).json({ message: "Sign in Successful", user: user._id });

    } catch (error) {
        logger.error("OTP verification failed", error.message);
        return res.status(500).json({ message: "OTP verification error"});
    }
}

// Forgot Password
/**
 * Handles the forgot password functionality by generating a password reset token and sending it to the user's email.
 * It checks if the email is provided and if the user exists, then generates a reset token and sends a reset password email.
 * The response includes a success message indicating that reset instructions have been sent.
 * If the email is not provided or the user does not exist, it returns an appropriate error message.
 * Any errors during the process are logged and returned in the response.
 */
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        logger.error("Email is required.");
        return res.status(400).json({ message: "Email is required."});
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.info("Invalid user credentials.");
            return res.status(200).json({ message: "If an account exists, reset instructions will be sent to your email." });
        }
        // Generate verification token
        const { token } =  await Token.generateToken(user._id, "password_reset", 15);
        const resetLink = `${process.env.FRONTEND_URL}/reset/${token}` ;
        
        // Send reset password email
        const resetPasswordEmail = resetPasswordTemplate(user.firstName, resetLink);
        const subject = `${process.env.APP_NAME} - Reset your password`;
        await sendEmail(user.email, subject, resetPasswordEmail);
        logger.info(`Password reset requested by: ${email}`);
        return res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        logger.error(`Error processing account password reset for: ${email}`);
        return res.status(500).json({ message: "Error processing account password reset", error: error.message })
    }
};

// Reset Password
/**
 * Handles the password reset functionality by verifying the provided reset token and updating the user's password.
 * It checks if the token and new password are provided, verifies the token, retrieves the associated user, and updates their password.
 * If the reset is successful, it removes the reset token from the database and returns a success message.
 * If the token is invalid or expired, or if any error occurs, it returns an appropriate error message.
 */
export const  resetPassword = async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: "Token and password are required." });
    }
    
    try {
        const resetToken = await Token.verifyToken("password_reset", token);
        if (!resetToken) {
            return res.status(400).json({ message: "Invalid or expired reset link." });
        }

        const user = await User.findById(resetToken.userId);
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset link." });
        }

        user.password = password;
        await user.save();
        await Token.removeToken(user._id, resetToken.type);
        logger.info(`User password has been reset - ${user.email}`);
        return res.status(200).json({ message: "Password reset successful." });
    } catch (error) {
        logger.error("Password reset failed", error);
        return res.status(500).json({ message: "Password reset failed", error: error.message });
    }
};

// Sign Out
/**
 * Handles user sign-out by clearing the authentication token cookie.
 * It returns a success message indicating that the sign-out was successful.
 */
export const signout = async (req, res) => {
    res.clearCookie("token");
    logger.info("User sign out successful.");
    return res.status(200).json({ message: "Sign out successful." });
};

export default { 
    authCheck,
    signup,
    signin,
    signout,
    verifyAccount,
    signinWithOTP,
    resendOTP,
    verifyOTP,
    forgotPassword,
    resetPassword,
};

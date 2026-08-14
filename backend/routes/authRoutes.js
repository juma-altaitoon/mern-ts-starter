import express from 'express';
import auth from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.get("/me", authenticate, auth.authCheck);
authRouter.post("/signup", auth.signup);
authRouter.post("/signin", auth.signin);
authRouter.post("/signin-otp", auth.signinWithOTP);
authRouter.post("/resend-otp", auth.resendOTP);
authRouter.post("/verify-otp", auth.verifyOTP);
authRouter.post("/forgot-password", auth.forgotPassword);
authRouter.post("/reset-password", auth.resetPassword);
authRouter.post("/verify/:token", auth.verifyAccount);
authRouter.post("/signout", auth.signout);

export default authRouter;

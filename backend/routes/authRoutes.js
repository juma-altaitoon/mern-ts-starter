import express from 'express';
import auth from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.get("/me", authenticate, auth.authCheck);
authRouter.post("/signup", auth.signup);
authRouter.post("/signin", auth.signin);
authRouter.post("/signout", auth.signout);

export default authRouter;

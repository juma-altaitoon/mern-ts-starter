import express from 'express';
import user from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.get("/profile", authenticate, user.getProfile);
userRouter.put("/profile", authenticate, user.updateProfile);

export default userRouter;
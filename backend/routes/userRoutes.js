import express from 'express';
import user from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.get("/profile", authenticate, user.getProfile);
userRouter.put("/profile", authenticate, user.updateProfile);

userRouter.get("/list", authenticate, authorize('admin'), user.listUsers);

export default userRouter;
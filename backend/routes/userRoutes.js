import express from 'express';
import user from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import upload from "../middleware/uploadMiddleware.js";
import uploadRateLimiter, { checkAuthBeforeRateLimit } from "../middleware/uploadRateLimiter.js";
import { uploadAvatarController, deleteAvatarController } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get("/profile", authenticate, user.getProfile);
userRouter.put("/profile", authenticate, user.updateProfile);
userRouter.post("/avatar/upload", authenticate, checkAuthBeforeRateLimit, uploadRateLimiter, upload.single("avatar"), uploadAvatarController);
userRouter.delete("/avatar", authenticate, deleteAvatarController);

userRouter.get("/list", authenticate, authorize('admin'), user.listUsers);


export default userRouter;
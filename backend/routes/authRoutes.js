import express from 'express';
import auth from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post("/signup", auth.signup);
authRouter.post("/signin", auth.signin);
authRouter.post("/signout", auth.signout);

export default authRouter;

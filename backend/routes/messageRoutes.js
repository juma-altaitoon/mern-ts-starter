import express from 'express';
import message from "../controllers/messageController.js";
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const messageRouter = express.Router();

messageRouter.post('/create', message.createMessage);
messageRouter.get('/list', authenticate, authorize('admin'), message.listMessages);

export default messageRouter;
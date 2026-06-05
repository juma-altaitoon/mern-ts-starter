import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 mins
    max: 100,  // limit of 100 reqs per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: "To many requests, please try again later.",
});

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use('/api/', limiter);
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);
app.use(errorHandler);

export default app;
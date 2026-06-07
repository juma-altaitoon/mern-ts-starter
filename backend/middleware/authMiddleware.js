import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import logger from './logger.js';

dotenv.config();

// User authentication check
export const authenticate = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({ message: "Unauthorized access."});
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user.id;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            logger.error("Token expired. ", error.message);
            return res.status(401).json({ message: "Token expired. Please Sign in again.", error: error.message });
        }
        
        logger.error("Authentication error: ", error.message);
        return res.status(401).json({ message: "Invalid token. Please sign in.", error: error.message })
    }
}
// User authorization check
export const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Get user role
            const user = await User.findById(req.user).select("role");
            if (!user) {
                logger.error("User not found for authorization.");
                return res.status(404).json({ message: "User not found." });
            }
            // Check if user role is in allowed roles
            if (!allowedRoles.includes(user.role)) {
                logger.error(`Forbidden access. User role: ${user.role}`);
                return res.status(403).json({ message: "Forbidden Access." });
            }
            next();
        } catch (error) {
            logger.error("Authorization error: ", error.message);
            return res.status(403).json({ message: "Server error", error: error.message });
        }
    };
}

export default { authenticate, authorize }
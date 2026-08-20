/**
 * Upload Rate Limiting Middleware
 * ================================
 * This module implements rate limiting specifically for avatar uploads
 * to prevent abuse and DoS attacks.
 * 
 * OWASP A05:2021 – Broken Access Control / A07:2021 – Identification and Authentication Failures
 * Rate limiting prevents brute force attacks and resource exhaustion.
 * 
 * Configuration:
 * - 3 uploads per 5 minutes per authenticated user
 * - Stored in memory (suitable for single-server deployments)
 * - Can be upgraded to Redis for distributed deployments
 */

import rateLimit from 'express-rate-limit';
import logger from './logger';

const uploadRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // milliseconds
    max: 3, // 3 uploads per 5 minutes per user
    keyGenerator: (req, res) => {
        if(!req.user) {
            logger.warn("Upload rate limiter: Request without authenticated user");
            return 'anonymous';
        }
        return req.user // use id as the rate key
    },
    
    handler: (req, res, next, options) => {
        logger.warn(`Upload rate limit exceeded for user: ${req.user}`);
        return res.status(429).json({
            message: "Too many avatar upload attempts. Please try again in a few minutes.",
            retryAfter: options.windowMs / 1000, // Seconds until next upload is allowed
        });
    },
    // Include rate limit information in response headers
    // Enable clients to understand their rate limit status
    standardHeaders: true, // Return info in 'RateLimit-*' headers
    legacyHeaders: false, // Disable 'X-RateLimit-*' headers (deprecated)
    // Message when rate limit is exceeded
    message: "Too many avatar upload attempts. Please try again later.",
});

/**
 * Middleware function to check if user is authenticated before rate limiting
 * 
 * Purpose: Prevent unauthenticated requests from hitting the rate limiter
 * This is a defensive measure; should be chained after authMiddleware anyway.
 * 
 * Usage in routes:
 * router.post('/avatar/upload', authenticate, uploadRateLimiter, multer.single('avatar'), controller);
 */
export const checkAuthBeforeRateLimit = (req, res, next) => {
    if (!req.user) {
        logger.warn('Attempt to upload avatar without authentication');
        return res.status(401).json({ message: "Unauthorized. Please log in" });
    }
    next();
};

export default uploadRateLimiter;

/**
 * Cloudinary Configuration File.
 * ==================================================
 * This module initializes and exports the Cloudinary SDK with credentials
 * loaded from environment variables. It provides a configured instance
 * ready for file uploads, deletions, and transformations.
 */
import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Validate that all required Cloudinary credentials are present  
 */ 
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    logger.error("Cloudinary configuration is missing. Please check your environment variables.");
    // throw new Error("Cloudinary configuration is missing. Please check your environment variables.");
    process.exit(1); // Exit the process if configuration is missing
};

logger.info("Cloudinary SDK initialized successfully.");

export default cloudinary;

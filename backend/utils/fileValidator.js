/**
 * File Validator Utility
 * ==================================================
 * This module provide reusable file validation functions for uploads.
 * It enforces:
 * - File type restrictions (e.g., images only)
 * - File size limits
 * - Extension checks
 * - Clear error messages for frontend feedback
 */

import logger from '../mmiddleware/logger.js';

/**
 * Maximum file size allowed for uploads (5MB).
 * Allowed MIME types for avatar uploads (JPEG, PNG)
 * Allowed file extension for avatar uploads (.jpg, .jpeg, .png)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png"];

/**
 * Validates a file object against security and format criteria
 * 
 * @param {Object} file - Multer file object containing:
 *   - mimetype: MIME type from upload header
 *   - size: file size in bytes
 *   - originalname: original filename from upload
 *   - buffer: file contents (if using memory storage)
 * 
 * @returns {Object} Validation result:
 *   - {valid: true} if file passes all checks
 *   - {valid: false, error: string} if validation fails with user-friendly error message
 * 
 */
export const validateAvatarFile = (file) => {
    // ===== Check 1: File object exists =====
    if (!file) {
        logger.warn("File calidation failed: No file provided.");
        return {
            valid: false,
            error: "No file provided. Please choose an image to upload",
        };
    }
    // ===== Check 2: MIME type validation =====
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        logger.warn(`File validation failed: Invalid MIME type ${file.mimetype} for file: ${file.originalname}`);
        return {
            valid: false,
            error: "Invalid file type. Only JPEG and PNG images are allowed.",
        }
    }

    // ===== Check 3: File extension validation =====
    const fileExtension = `${file.originalname.substring(file.originalname.lastIndexOf('.'))}`.toLowerCase();
    
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        logger.warn(`File validation failed: Invalid extension ${fileExtension} for file: ${file.originalname}`);
        return {
            valid: false,
            error: "Invalid file extension. Only .jpg, .jpeg, and .png files are allowed.",
        }
    }
    // ===== Check 4: File size validation =====
    if (file.size > MAX_FILE_SIZE) {
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        logger.warn(`File validation failed: File size ${sizeInMB}MB exceeds limit for file: ${file.originalname}`);
        return {
            valid: false,
            error: `File size exceeds the 5MB limit. Your file is ${sizeInMB}MB.`,
        }
    }
    
    // ===== All checks passed =====
    logger.info(`File validation successful for file ${file.originalname}`);
    return { valid: true };
};

/**
 * Helper function to check if a file size is within limits
 * Useful for client-side validation and early rejection
 * 
 * @param {number} fileSizeBytes - File size in bytes
 * @returns {Object} {withinLimit: boolean, maxSizeMB: number}
 */
export const isFileSizeValid = (fileSizeBytes) => {
  return {
    withinLimit: fileSizeBytes <= MAX_FILE_SIZE,
    maxSizeMB: MAX_FILE_SIZE / (1024 * 1024),
  };
};

/**
 * Helper function to check if a MIME type is allowed
 * 
 * @param {string} mimetype - MIME type to check
 * @returns {boolean} true if MIME type is in whitelist
 */
export const isMimeTypeAllowed = (mimetype) => {
  return ALLOWED_MIME_TYPES.includes(mimetype);
};

/**
 * Export configuration constants for frontend use
 * Frontend can import these to validate files before upload
 */
export const FILE_UPLOAD_CONFIG = {
  maxSizeMB: MAX_FILE_SIZE / (1024 * 1024),
  maxSizeBytes: MAX_FILE_SIZE,
  allowedMimeTypes: ALLOWED_MIME_TYPES,
  allowedExtensions: ALLOWED_EXTENSIONS,
};
/**
 * File Upload Middleware
 * ==================================================
 * This module configures and exports a Multer middleware for handling file uploads.
 * It's specifically set up for avatar uploads, enforcing file size limits and type restrictions.
 * With the following features:
 * - In-memory storage (no disk writes)
 * - Single file upload per request
 * - Field name: 'avatar'
 * - Size limits with error handling
 */

import multer from 'multer';
import logger from "../middleware/logger.js";

/**
 * Configure Multer storage strategy
 * ================================
 * We use memory storage (memoryStorage) instead of disk storage for several reasons:
 * 1. Stateless: No server-side disk state; suitable for horizontal scaling
 * 2. Security: No temporary files on disk (reduces attack surface)
 * 3. Performance: Direct file buffer to Cloudinary (no intermediate disk I/O)
 * 4. Cloud-friendly: Works seamlessly with containerized deployments
 * 
 * Note: Memory is used for file buffering, but files are small avatars (< 5MB)
 * and multer processes them sequentially, so memory pressure is minimal.
 */

/**
 * Multer configuration object
 * 
 * @property {Object} storage - Storage strategy (memoryStorage defined above)
 * @property {number} limits - Size and field limits
 *   - fileSize: 6MB (1MB buffer above 5MB max to catch oversized files)
 *   - fieldSize: 10MB (for form fields, not used in avatar upload)
 *   - files: 1 (only accept single file)
 *   - fields: 2 (minimal form fields, if any)
 * 
 * Note: Limits prevent large uploads that could cause memory exhaustion or DoS
 */
const storage = multer.memoryStorage();
const limits = {
    fileSize: 6 * 1024 * 1024, // 1MB buffer above max size
    fieldSize: 10 * 1024 * 1024,
    files: 1,
    fields: 2,
};

/**
 * File filter function
 * OWASP: Additional layer of defense against malicious uploads
 * 
 * Even though multer doesn't perform validation by default, we can optionally
 * add a filter here to reject files before they're written to memory.
 * 
 * In this case, we accept all files here and validate them later in the controller.
 * This separation of concerns keeps validation logic centralized in fileValidator.js
 */
const fileFilter = (req, res, cb) => {
    logger.debug(`Upload middleware: recieved file ${file.originalname}`);
    cb(null, true);
};

/**
 * Create the Multer instance with the configuration
 * 
 * The resulting middleware is a function that processes multipart/form-data
 * and extracts the uploaded file into req.file
 */
const upload = multer({
    storage,
    limits,
    fileFilter,
});

export default upload;
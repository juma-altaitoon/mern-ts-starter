import User from '../models/User.js';
import logger from '../middleware/logger.js';
import { validateAvatarFile } from "../utils/fileValidator.js";
import { uploadAvatar, deleteAvatar } from '../services/avatarServices.js';


const protectedFields = [ "-password", "-role" ];

/**
 * Handles the retrieval of the authenticated user's profile.
 * It uses the user ID from the request (set by authentication middleware) to find the user in the database.
 * If the user is found, it returns the user's profile information excluding sensitive fields.
 * If an error occurs during retrieval, it returns an error response.
 */
export const getProfile = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId).select(protectedFields);
        return res.status(200).json({ message: "User profile retrieved", user })
    } catch (error) {
        logger.error("Error retrieving user profile", error.message);
        return res.status(500).json({ message: "Server error" });
    }
}

/**
 * Handles the update of the authenticated user's profile.
 * It receives the updated profile details from the request body and updates the corresponding user in the database.
 * If the update is successful, it returns the updated user profile excluding sensitive fields.
 * If the user is not found or an error occurs during the update, it returns an appropriate error response.
 */
export const updateProfile = async (req, res) => {
    const userId = req.user;
    const {
        firstName,
        lastName,
        country,
        city,
        dateOfBirth,
        avatar,
    } = req.body; 

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                country,
                city,
                dateOfBirth,
                avatar,
            }, { new: true }
        ).select(protectedFields);

        if (!updatedUser) {
            logger.error("Profile update failed.");
            return res.status(404).json({ message: "Profile Update failed."})
        }
        logger.info("Profile update successful");
        return res.status(200).json({ message: "Profile update successful.", user: updatedUser });

    } catch (error) {
        logger.error("Profile update failed.", error.message);
        return res.status(500).json({ message: "Server error" });
    }
}

/**
 * Handles the retrieval of all users in the system.
 * It queries the database for all users and returns their information excluding sensitive fields.
 * If no users are found, it returns a message indicating that no users were found.
 * If an error occurs during retrieval, it returns an error response.
 */
export const listUsers = async (req, res) => {
    try {
        const users = await User.find().select(protectedFields);
        if (!users || users.length === 0) {
            return res.status(200).json({ message: "No users found.", users });
        }
        logger.info("Users retrieved successfully")
        return res.status(200).json({ message: "Users retrieved successfully", messages});
    } catch (error) {
        logger.error("Error retrieving users: ", error.message);
        return res.status(500).json({ message: "Error retrieving users.", error: error.message });
    }
}

/**
 * Upload Avatar Controller
 * ========================
 * Handles POST requests to upload a user's avatar.
 * 
 * Flow:
 * 1. Verify file was uploaded (multer populates req.file)
 * 2. Validate file against security criteria (type, size, extension)
 * 3. Call avatarService to upload to Cloudinary
 * 4. Update user document with avatar URL
 * 5. Return updated user object
 * 
 * OWASP Security:
 * - Authorization: authenticate middleware ensures req.user is set
 * - Rate limiting: uploadRateLimiter middleware ensures max 3 uploads per 5 min
 * - File validation: validateAvatarFile checks MIME type, size, extension
 * - Error handling: No sensitive data (file paths, system errors) exposed to frontend
 * 
 * @param {Express.Request} req - HTTP request with:
 *   - req.user: authenticated user ID (from authMiddleware)
 *   - req.file: uploaded file object (from multer)
 * 
 * @param {Express.Response} res - HTTP response to send back to client
 * 
 * @returns {JSON} 
 *   - 200 OK: {message, user} with updated user object including avatar URL
 *   - 400 Bad Request: {message} if file validation fails
 *   - 401 Unauthorized: if user not authenticated
 *   - 413 Payload Too Large: if file exceeds size limits
 *   - 500 Internal Server Error: if Cloudinary upload fails
 */
export const uploadAvatarController = async (req, res) => {
    const userId = req.user;
    try {
        logger.info(`Avatar upload initiated for user ${userId}`);
        // Step 1: Check if multer provided a file
        if (!req.file) {
            logger.warn(`Avatar upload failed for user ${userId}: no file provided`);
            return res.status(400).json({ message: "No file was selected. Please choose an image to upload."});
        }
        // Step 2: Validate file against security criteria
        // - MIME type whitelist check
        // - File extension validation
        // - File size validation
        const validation = validateAvatarFile(req.file);
        if (!validation.valid) {
            logger.warn(`Avatar upload validation failed for user ${userId}: ${validation.error}`);
            return res.status(400).json({ message: validation.error });
        }
        logger.info(`File validation successful for user ${userId}: ${req.file.originalname}`);

        // Upload file to Cloudinary
        // This function:
        // - Creates a Cloudinary upload stream
        // - Organizes files by user ID (folder: avatars/{userId})
        // - Returns the secure URL and public ID
        let uploadResult;
        try {
            uploadResult = await uploadAvatar(req.file, userId);
            logger.info(`Cloudinary upload successful for user ${userId}: ${uploadResult.url}`);

        } catch (cloudinaryError) {
            logger.error(`Cloudinary upload failed for user ${userId}: ${cloudinaryError.message}`);
            return res.status(500).json({ message: `Failed to upload avatar. Please try again later.` });
        }

        // Step 4: Update user document with avatar URL and metadata
        // Store both:
        // - avatar: the Cloudinary URL (displayed in UI)
        // - avatarPublicId: Cloudinary's public ID (used for deletion)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                avatar: uploadResult.url,
                avatarPublicId: uploadResult.publicId,
            },
            { new: true } // Return the updated document
        ).select(protectedFields); 

        if (!updatedUser) {
            logger.error(`User not found during avatar update: ${userId}`);
            return res.status(404).json({ message: "User not found" });
        }

        logger.info(`Avatar updated successfully for user: ${userId}`);
        // Step 5: Return success response with updated user object
        return res.status(200).json({
            message: "Avatar uploaded successfully",
            user: updatedUser,
        });
    } catch (error) {
        logger.error(`Unexpected error during avatar upload for user: ${userId}`, error.message);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};

/**
 * Delete Avatar Controller
 * ========================
 * Handles DELETE requests to remove a user's avatar.
 * 
 * Flow:
 * 1. Fetch user document to get current avatar publicId
 * 2. If avatar exists, delete from Cloudinary
 * 3. Clear avatar fields from user document
 * 4. Return updated user object (avatar now null, fallback to initials)
 * 
 * OWASP Security:
 * - Authorization: authenticate middleware ensures user can only delete their own avatar
 * - Error handling: Gracefully handles missing avatars (idempotent operation)
 * 
 * @param {Express.Request} req - HTTP request with:
 *   - req.user: authenticated user ID (from authMiddleware)
 * 
 * @param {Express.Response} res - HTTP response to send back to client
 * 
 * @returns {JSON}
 *   - 200 OK: {message, user} with updated user object (avatar now null)
 *   - 401 Unauthorized: if user not authenticated
 *   - 404 Not Found: if user not found
 *   - 500 Internal Server Error: if deletion fails
 */
export const deleteAvatarController = async (req, res) => {
    const userId = req.user;

    try {
        logger.info(`Avatar deletion initiated for user: ${userId}`);
        // Step 1: Fetch current user to get avatar publicId
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(`Avatar deletion failed: user not found ${userId}`);
            return res.status(404).json({ message: "User not found" });
        }
        // Step 2: Check if user has an avatar to delete
        if (!user.avatarPublicId) {
            logger.info(`Avatar deletion for user ${userId}: no avatar to delete`);

            user.avatar = null;
            user.avatarPublicId = null;
            await user.save();

            return res.status(200).json({
                message: "Avatar removed successfully.",
                user: user.toObject({ virtuals: true, versionKey: false }),
            });
        }

        // Step 3: Delete avatar from Cloudinary
        try {
            const deleteResult = await deleteAvatar(user.avatarPublicId);
            logger.info(`Cloudinary deletion result for user ${userId}: ${deleteResult.result}`);
        } catch (cloudinaryError) {
            logger.error(`Cloudinary deletion failed for user ${userId}`, cloudinaryError.message)
        }
        // Step 4: Clear avatar from user document
        // Whether Cloudinary deletion succeeded or not, clear the avatar reference
        // from database to prevent orphaned references 
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                avatar: null, // Clear the Cloudinary URL
                avatarPublicId: null, // Clear the public ID reference 
            },
            { new: true } // Return updated document
        ).select(protectedFields);

        logger.info(`Avatar cleared from user document for user ${userId}`);
        // Step 5: Return success response
        // Frontend will now display initials fallback since avatar is null
        return res.status(200).json({
            message: "Avatar removed successfully",
            user: updatedUser,
        });

    } catch (error) {
        logger.error(`Error during avatar deletion for user ${userId}`, error.message);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export default { getProfile, updateProfile, listUsers };
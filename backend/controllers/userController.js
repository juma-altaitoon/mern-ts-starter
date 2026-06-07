import User from '../models/User.js';
import logger from '../middleware/logger.js';

const protectedFields = ["-password", "-role", "-resetToken", "-resetTokenExpiration"];

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

export default { getProfile, updateProfile };
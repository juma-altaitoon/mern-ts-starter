import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * User Schema
 * Model representing a user in the system.
 * Fields:
 * - email: The email address of the user (required, unique, lowercase, trimmed).
 * - firstName: The first name of the user (required, trimmed, maximum length of 50 characters).
 * - lastName: The last name of the user (required, trimmed, maximum length of 50 characters).
 * - password: The hashed password of the user (required, minimum length of 12 characters).
 * - role: The role of the user, which can be either "user" or "admin" (default: "user").
 * - country: The country of the user (optional, maximum length of 50 characters).
 * - city: The city of the user (optional, maximum length of 50 characters).
 * - dateOfBirth: The date of birth of the user (optional).
 * - avatar: The URL of the user's avatar image (optional, trimmed, default: null).
 * - status: The status of the user, which can be "active", "pending", or "suspended" (default: "pending").
 * - lastLogin: The date and time of the user's last login (optional).
 * Timestamps are automatically added to track when the user was created and last updated.
 */
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true,
        minlength: 12,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    country: {
        type: String,
        maxlength: 50,
    },
    city: {
        type: String,
        maxlength: 50,
    },
    dateOfBirth: {
        type: Date,
    },
    avatar: {
        type: String, // Cloudinary URL
        trim: true,
        default: null,
    },
    avatarPublicId: {
        type: String, // Cloudinary public ID for deletion reference
        default: null,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'suspended'],
        default: 'pending',
    },
    lastLogin: {
        type: Date
    },
}, {
    timestamps: true
});

/**
 * Pre-save middleware to hash the user's password before saving it to the database.
 * This middleware is triggered only if the password field has been modified.
 * It uses bcrypt to generate a salt and hash the password with a cost factor of 12.
 * The hashed password is then stored in the password field of the user document.
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compares the entered password with the hashed password stored in the database.
 * @param {string} enteredPassword - The password entered by the user during login.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, or false otherwise.
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generates a JSON Web Token (JWT) for the user.
 * The token contains the user's ID as the payload and is signed with a secret key.
 * The token has an expiration time defined in the environment variables (default: 1 hour).
 * @returns {string} - The generated JWT token.
 */
userSchema.methods.generateJWT = function() {
    const payload = {
        id: this._id,
    };
    const secret = process.env.JWT_SECRET;
    const options = {
        expiresIn: process.env.JWT_EXPIRY || '1h',
    };
    const token = jwt.sign(payload, secret, options);

    return token;
};

const User = mongoose.model('User', userSchema);
export default User;

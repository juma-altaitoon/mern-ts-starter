import mongoose from "mongoose";
import crypto from "crypto";

/**
 * Token Schema
 * Model representing a token used for various purposes such as account verification, password reset, and OTP (One-Time Password).
 * Fields:
 * - userId: The ID of the user associated with the token (required, references the User model).
 * - tokenHash: The hashed value of the token (required, unique).
 * - type: The type of the token, which can be "verify_account", "password_reset", or "otp" (required).
 * - expiresAt: The expiration date and time of the token (required, automatically deletes the document after 1 minute of expiration).
 * Timestamps are automatically added to track when the token was created and last updated.
 */
const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tokenHash: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: [ "verify_account", "password_reset", "otp" ],
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 60, // MongoDB will automatically delete the document after 1 minute (60 seconds) of expiration.
    },
}, { timestamps: true });


/**
 * Hashes the provided token value using SHA-256.
 * @param {string} value - The token value to be hashed.
 * @returns {string} - The hashed token value.
 */
function hashToken(value) {
    return crypto.createHash("sha256").update(value).digest("hex");
}

// ALTERNATIVE Token Expiry
// /**
//  * Creates a TTL (Time-To-Live) index on the expiresAt field of the token schema.
//  * This index allows MongoDB to automatically delete documents from the collection when the expiresAt field is reached.
//  * The expireAfterSeconds option is set to 60 seconds, meaning that documents will be removed 60 seconds after the expiresAt time.
//  * This ensures that expired tokens are automatically cleaned up from the database without requiring manual intervention.
//  * The TTL index is useful for managing temporary tokens, such as those used for account verification, password reset, or OTP (One-Time Password) functionality.
//  */
// tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });

/**
 * Creates an index on the token schema for efficient querying and cleanup of tokens based on userId and type.
 * This index allows for quick retrieval of tokens associated with a specific user and type, and also facilitates the removal of older or existing tokens when generating new ones.
 * The index is defined on the combination of userId and type fields, ensuring that each user can have only one token of a specific type at any given time.
 * This helps maintain the integrity of the token system and prevents multiple active tokens of the same type for a single user.
 */
tokenSchema.index({ userId: 1, type: 1 });

// Generate Token
/**
 * Generates a new token for a user based on the specified type and expiry duration.
 * @param {string} userId - The ID of the user for whom the token is being generated.
 * @param {string} type - The type of the token, which can be "verify_account", "password_reset", or "otp".
 * @param {number} [expiryInMinutes=15] - The duration in minutes after which the token will expire (default is 15 minutes).
 * @returns {Promise<{ token: string, tokenDoc: object }>} - An object containing the generated token value and the corresponding token document from the database.
 */
tokenSchema.statics.generateToken = async function (userId, type, expiryInMinutes = 15) {
    let tokenValue;

    if (type === 'otp') {
        tokenValue = Math.floor(100000 + Math.random() * 900000).toString();
    } else {
        tokenValue = crypto.randomBytes(32).toString("hex");
    }

    // Delete older/existing tokens with the same type.
    await this.deleteMany({ userId, type });

    // Hash token to store in DB
    const hashedToken = hashToken(tokenValue);



    const newToken = await this.create({
        userId,
        tokenHash: hashedToken,
        type,
        expiresAt: new Date(Date.now() + expiryInMinutes * 60 * 1000),
    });

    return {
        token: tokenValue,
        tokenDoc: newToken,
    };
};

// Verify Token
/**
 * Verifies the provided token for a specific type and checks if it is valid and not expired.
 * @param {string} type - The type of the token to verify, which can be "verify_account", "password_reset", or "otp".
 * @param {string} token - The token value to verify.
 * @returns {Promise<object|null>} - The token document if the token is valid and not expired; otherwise, null.
 */
tokenSchema.statics.verifyToken = async function (type, token) {
    if (!type || !token) {
        return null;
    }

    const hashedToken = hashToken(token);

    const storedToken = await this.findOne({
        tokenHash: hashedToken,
        type,
        expiresAt: { $gt: Date.now() },
    });

    return storedToken;
};

// Remove Token

/**
 * Removes all tokens of a specific type for a given user.
 * @param {string} userId - The ID of the user whose tokens are to be removed.
 * @param {string} type - The type of the tokens to remove, which can be "verify_account", "password_reset", or "otp".
 * @returns {Promise<void>} - A promise that resolves when the tokens have been removed.
 */
tokenSchema.statics.removeToken = async function (userId, type) {
    if (!userId) return;
    await this.deleteMany({ userId, type });    
};

const Token = mongoose.model('Token', tokenSchema);
export default Token;

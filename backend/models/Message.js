import mongoose from "mongoose";

/**
 * Message Schema
 * Model representing a message sent by a user through the contact form.
 * Fields:
 * - name: The name of the user sending the message (required).
 * - email: The email address of the user sending the message (required, lowercase, trimmed).
 * - content: The content of the message (required, trimmed).
 * - read: A boolean indicating whether the message has been read (default: false).
 * Timestamps are automatically added to track when the message was created and last updated.
 */
const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    read: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
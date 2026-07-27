import logger from "../middleware/logger.js";
import Message from "../models/Message.js";

// Create Message
export const createMessage = async (req, res) => {
    const { name, email, content } = req.body;

    const message = new Message({
        name,
        email,
        content,
    });

    try {
        await message.save()
        logger.info("Message received successfully.");
        return res.status(201).json({ message: "Message received." });
    } catch (error) {
        logger.error("Error receiving message", error);
        return res.status(500).json({ message: error.message });
    }
};

// List all messages
export const listMessages = async (req, res) => {
    
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        if (!messages || messages.length === 0) {
            return res.status(200).json({ message: "No messages found.", messages });
        }
        logger.info("Messages retrieved successfully")
        return res.status(200).json({ message: "Messages retrieved successfully", messages});    
    } catch (error) {
        logger.error("Error retrieving messages: ", error.message);
        return res.status(500).json({ message: "Error retrieving messages.", error: error.message });
    }   
};

export default { createMessage, listMessages };
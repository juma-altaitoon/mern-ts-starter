import User from '../models/User.js';
import logger from '../middleware/logger.js';

// Auth Check
export const authCheck = async (req, res) => {
    const userId = req.user;
    if (!req.user){
        return res.status(401).json({ message: "User not Logged in"})
    }
    try {
        const user = await User.findById(userId).select(["_id", "firstName"]);
        return res.status(200).json({ message: "User is signed in.", user});
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized access.", error: error.message});
    }
}

// Signup
export const signup = async (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
        country,
        city,
        dateOfBirth,
        avatar,
    } = req.body;
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email }); 
        if (existingUser) {
            logger.error("User already exists.");
            return res.status(400).json({ message: "User already exists." });
        }   
    } catch (error) {
        logger.error("Error checking existing user", error);
        return res.status(500).json({ message: "Server error", error: error });
    }

    const user = new User({
        email,
        password,
        firstName,
        lastName,
        country,
        city,
        dateOfBirth,
        avatar,
    });

    try {
        await user.save();
        logger.info("User registered successfully.");
        return res.status(201).json({ message: "User registered successfully." })
    } catch (error) {
        logger.error("Error registering user", error);
        return res.status(500).json({ message: error.message });
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        logger.error("Email and password are required.");
        return res.status(400).json({ message: "All fields are required."});
    }

    try {
        const user = await User.findOne({ email });
        if (!user || ! await user.matchPassword(password)) {
            logger.info("Invalid user credentials.");
            return res.status(401).json({ message: "Invalid user credentials." });
        }

        const token = user.generateJWT();

        // Save JWT in a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
            maxAge: 1000 * 60 * 60,
        });
        logger.info(`Sign in successful for user: ${user._id}`);
        return res.status(200).json({ message: "Sign in Successful", user: user._id });

    } catch (error) {
        logger.error("Sign in error", error.message);
        return res.status(500).json({ message: "Sign in error"});
    }
}

export const signout = async (req, res) => {
    res.clearCookie("token");
    logger.info("User sign out successful.");
    return res.status(200).json({ message: "Sign out successful." });
}

export default { authCheck, signup, signin, signout };

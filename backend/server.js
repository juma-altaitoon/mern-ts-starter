import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB!"))
    .catch((error) => {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    });
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
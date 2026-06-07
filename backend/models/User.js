import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
        minLength: 12,
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
        type: String,
        trim: true,
        default: null,
    },
    resetToken: {
        type: String,
        default: null,
    },
    resetTokenExpiration: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active',
    },
    lastLogin: {
        type: Date
    },
}, {
    timestamps: true
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare passwords on Login
userSchema.methods.matchPassword = async function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
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

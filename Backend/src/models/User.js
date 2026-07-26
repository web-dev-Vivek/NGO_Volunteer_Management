// User Model schema
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minlength: 2,
            maxlength: 50
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            minlength: 2,
            maxlength: 50
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true
        },

        profileImage: {
            type: String,
            default: ""
        },
        bio: {
            type: String,
            trim: true,
            maxlength: 300,
            default: ""
        },
        skills: [{
            type: String,
            trim: true
        }],
        availability: [{
            type: String,
            trim: true
        }],
        emergencyContact: {
            name: { type: String, trim: true, default: "" },
            phone: { type: String, trim: true, default: "" }
        },
        organization: {
            type: String,
            trim: true,
            default: ""
        },
        experience: {
            type: Number,
            default: 0,
            min: 0
        },
        role: {
            type: String,
            enum: ["volunteer", "coordinator", "admin", "User"],
            default: "User"
        },
        status: {
            type: String,
            enum: ["pending", "active", "inactive", "blocked", "rejected"],
            default: "pending"
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        verification: {
            type: String,
            enum: ["not_required", "pending", "verified", "rejected"],
            default: "pending"
        },
        lastLogin: {
            type: Date
        },

        isDeleted: {
            type: Boolean,
            default: false
        },
        createdAt: { type: Date },
        updatedAt: { type: Date }
    }
);



export default mongoose.model('User', UserSchema);

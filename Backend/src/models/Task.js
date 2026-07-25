// Task Model schema
import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, "Task description is required"],
        trim: true,
        maxlength: 1000
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: [true, "Campaign reference required"]
    },
    assignedVolunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Volunteer reference required"]
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Assigned user required"]
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed", "verified", "cancelled"],
        default: "pending"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
    },
    dueDate: {
        type: Date,
        required: true
    },
    attendance: {
        checkInTime: { type: Date },
        checkOutTime: { type: Date },
        hoursLogged: { type: Number, default: 0, min: 0 },
        status: {
            type: String,
            enum: ["unmarked", "present", "absent", "verified", "rejected"],
            default: "unmarked"
        }
    },
    checkInLocation: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    verifiedAt: {
        type: Date
    },
    assignmentHistory: [{
        volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        assignedAt: { type: Date, default: Date.now }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: { type: Date },
    updatedAt: { type: Date }
}
);

export default mongoose.model('Task', TaskSchema);

import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Recipient is required"],
            index: true
        },

        title: {
            type: String,
            required: [true, "Notification title is required"],
            trim: true,
            maxlength: 100
        },

        message: {
            type: String,
            required: [true, "Notification message is required"],
            trim: true,
            maxlength: 500
        },

        type: {
            type: String,
            enum: [
                "task",
                "certificate",
                "approval",
                "campaign",
                "system"
            ],
            default: "system"
        },

        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        referenceModel: {
            type: String,
            enum: [
                "Task",
                "Campaign",
                "Certificate",
                "User"
            ],
            default: null
        },

        isRead: {
            type: Boolean,
            default: false,
            index: true
        },

        readAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Compound index for faster notification queries
NotificationSchema.index({
    recipient: 1,
    isRead: 1,
    createdAt: -1
});

export default mongoose.model("Notification", NotificationSchema);
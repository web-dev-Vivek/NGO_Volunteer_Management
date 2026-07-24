// Certificate Model schema
import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
    {
        volunteerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Volunteer reference required"]
        },
        campaignId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: [true, "Campaign reference required"]
        },
        certificateNumber: {
            type: String,
            required: true,
            unique: true
        },
        title: {
            type: String,
            default: "Volunteer Appreciation Certificate"
        },
        description: {
            type: String,
            maxlength: 500,
            default: ""
        },
        hoursCompleted: {
            type: Number,
            default: 0,
            min: 0
        },
        issuedDate: {
            type: Date,
            default: Date.now
        },
        certificateHash: {
            type: String,
            required: true,
            unique: true
        },
        qrCode: {
            type: String,
            default: ""
        },
        verificationUrl: {
            type: String,
            default: ""
        },
        certificateFile: {
            type: String,
            required: true
        },
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["valid", "revoked"],
            default: "valid"
        },
        revokedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        revokedAt: {
            type: Date
        },
        revocationReason: {
            type: String,
            default: ""
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        createdAt: { type: Date },
        updatedAt: { type: Date }
    }
)

export default mongoose.model("Certificate", CertificateSchema)
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
       qrCode:{
    type:String,
    default:""
},
        certificateUrl: {
            type: String,
            required: true
        },
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        issuedFor:{
    type:String,
    required:true
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
        isDeleted:{
    type:Boolean,
    default:false,
    select:false
},

    },
     {
      timestamps:true
   }
)


CertificateSchema.index({
    volunteerId:1
});

CertificateSchema.index({
    certificateHash:1
});
CertificateSchema.index({
    issuedBy: 1
});

CertificateSchema.index({
    certificateNumber:1
});


CertificateSchema.index(
    {
        volunteerId:1,
        campaignId:1
    },
    {
        unique:true
    }
);
export default mongoose.model("Certificate", CertificateSchema)

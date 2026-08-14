// Certificate controllers


import Certificate from "../../models/Certificate.js";
import User from "../../models/User.js";
import Campaign from "../../models/Campaign.js";

import generateCertificateNumber from "../../utils/generateCertificateNumber.js";
import generateCertificateHash from "../../utils/generateCertificateHash.js";
import generateQRCode from "../../utils/generateQRCode.js";
import generateCertificatePDF from "../../utils/generateCertificatePDF.js";
import uploadCertificate from "../../utils/uploadCertificate.js";

export const uploadCertificateController = (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a certificate file."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Certificate file uploaded successfully.",
            file: {
                filename: req.file.filename,
                path: `/uploads/certificates/${req.file.filename}`,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        next(error);
    }
};

export const generateCertificate = async (req, res, next) => {

    try {

        const {

    volunteerId,

    campaignId,

    hoursCompleted

} = req.body;

if (!hoursCompleted || hoursCompleted <= 0) {
    return res.status(400).json({
        success: false,
        message: "Hours completed must be greater than zero."
    });
}


const [volunteer, campaign] = await Promise.all([

    User.findById(volunteerId).select(
        "firstName lastName email role status"
    ),

    Campaign.findById(campaignId).select(
        "title status"
    )

]);
if(!volunteer){
    return res.status(404).json({
        success:false,
        message:"Volunteer not found"
    });
}

if (volunteer.role !== "volunteer") {
    return res.status(400).json({
        success: false,
        message: "Selected user is not a volunteer."
    });
}

if (volunteer.status !== "active") {
    return res.status(400).json({
        success: false,
        message: "Volunteer account is not active."
    });
}


if(!campaign){
    return res.status(404).json({
        success: false,
        message: "Campaign not found"
    });
}

if (campaign.status !== "completed") {
    return res.status(400).json({
        success: false,
        message: "Certificate can only be generated after campaign completion."
    });
}


const alreadyIssued =
await Certificate.findOne({

    volunteerId,

    campaignId

});

if(alreadyIssued){
    return res.status(400).json({
        success: false,
        message: "Certificate already issued for this volunteer and campaign"
    });
}


const certificateNumber =
await generateCertificateNumber();

const certificateHash = await
generateCertificateHash();

const verificationUrl =

`${process.env.CLIENT_URL || "http://localhost:5173"}/verify/${certificateHash}`;
const qrCode =
await generateQRCode(verificationUrl);



const pdfBuffer =
await generateCertificatePDF({

    volunteer,

    campaign,

    certificateNumber,

    hoursCompleted,

    issuedDate:new Date(),

    verificationUrl,

    qrCode

});

const uploadResult =
await uploadCertificate(

    pdfBuffer,

    certificateNumber

);

const certificate =
await Certificate.create({

    volunteerId,

    campaignId,

    certificateNumber,

    certificateHash,

    qrCode,

    certificateUrl:uploadResult.secure_url,

    hoursCompleted,

    issuedBy:req.user._id,

    issuedFor:`${volunteer.firstName} ${volunteer.lastName}`

});
return res.status(201).json({

    success:true,

    message:"Certificate generated successfully.",

    data:certificate

});

    } catch (error) {

        next(error);

    }

};




// Public certificate verification
export const verifyCertificate = async (req, res, next) => {

    try {
        const { hash } = req.params;

const certificate = await Certificate.findOne({

    certificateHash: hash,

    isDeleted: false

})

.populate(

    "volunteerId",

    "firstName lastName email"

)

.populate(

    "campaignId",

    "title"

)

.populate(

    "issuedBy",

    "firstName lastName"

);


if (!certificate || certificate.status === "revoked") {
    return res.status(404).json({
        success: false,
        message: "Certificate not found or revoked"
    });
}

return res.status(200).json({

    success:true,

    valid:true,

    data:{

        certificateNumber:

        certificate.certificateNumber,

        volunteer:

        certificate.volunteerId,

        campaign:

        certificate.campaignId,

        hoursCompleted:

        certificate.hoursCompleted,

        issuedDate:

        certificate.issuedDate,

        issuedBy:

        certificate.issuedBy,

        certificateUrl:

        certificate.certificateUrl

    }

});
    } catch (error) {

        next(error);

    }

};

// Signed-in user's certificates
export const getMyCertificates = async (req, res, next) => {
    try {

        const volunteerId = req.user._id;

        const certificates = await Certificate.find({
            volunteerId,
            isDeleted: false
        })
            .populate("campaignId", "title category")
            .populate("issuedBy", "firstName lastName")
            .sort({ createdAt: -1 });

        if (certificates.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No certificates found.",
                count: 0,
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            count: certificates.length,
            data: certificates
        });

    } catch (error) {
        next(error);
    }
};


// Admin certificate list
export const getAllCertificates = async (req, res, next) => {

    try {

        const {
            page = 1,
            limit = 10,
            status,
            search
        } = req.query;

        const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
        const limitNumber = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 10));

        const skip = (pageNumber - 1) * limitNumber;

        const filter = {
            isDeleted: false
        };

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.certificateNumber = {
                $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                $options: "i"
            };
        }

        const certificates = await Certificate.find(filter)
            .populate("volunteerId", "firstName lastName email")
            .populate("campaignId", "title")
            .populate("issuedBy", "firstName lastName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        const totalCertificates =
            await Certificate.countDocuments(filter);

        return res.status(200).json({

            success: true,

            count: certificates.length,

            totalCertificates,

            currentPage: pageNumber,

            totalPages: Math.ceil(totalCertificates / limitNumber),

            data: certificates

        });

    } catch (error) {

        next(error);

    }

};



// Revoke a certificate

export const revokeCertificate = async (req, res, next) => {
    try {

        const { id } = req.params;
        const reason = req.body.reason?.trim();

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: "Revocation reason is required."
            });
        }

        const certificate = await Certificate.findById(id);

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found."
            });
        }

        if (certificate.status === "revoked") {
            return res.status(400).json({
                success: false,
                message: "Certificate is already revoked."
            });
        }

        certificate.status = "revoked";
        certificate.revokedBy = req.user._id;
        certificate.revokedAt = new Date();
        certificate.revocationReason = reason;

        await certificate.save();

        const updatedCertificate = await Certificate.findById(certificate._id)
            .populate("volunteerId", "firstName lastName email")
            .populate("campaignId", "title")
            .populate("revokedBy", "firstName lastName");

        return res.status(200).json({
            success: true,
            message: "Certificate revoked successfully.",
            data: updatedCertificate
        });

    } catch (error) {
        next(error);
    }
};


// Get a certificate download link

export const downloadCertificate = async (req, res, next) => {

    try {

        const { id } = req.params;

        const certificate = await Certificate.findById(id);

        if (!certificate) {

            return res.status(404).json({
                success: false,
                message: "Certificate not found."
            });

        }

        if (
    req.user.role !== "admin" &&
    certificate.volunteerId.toString() !== req.user._id.toString()
) {
    return res.status(403).json({
        success: false,
        message: "You are not authorized to download this certificate."
    });
}


        if (certificate.status === "revoked") {

            return res.status(400).json({
                success: false,
                message: "Certificate has been revoked."
            });

        }

        if (!certificate.certificateUrl) {

            return res.status(404).json({
                success: false,
                message: "Certificate file not found."
            });

        }

        return res.status(200).json({

            success: true,

            downloadUrl: certificate.certificateUrl

        });

    } catch (error) {

        next(error);

    }

};




// Certificate Statistics
export const getCertificateStats = async (req, res, next) => {
  try {
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const stats = await Certificate.aggregate([
      {
        $match: {
    isDeleted: false,
    status: {
        $in: ["valid", "revoked"]
    }
}
      },
      {
        $group: {
          _id: null,

          totalCertificates: { $sum: 1 },

          validCertificates: {
            $sum: {
              $cond: [
                { $eq: ["$status", "valid"] },
                1,
                0
              ]
            }
          },

          revokedCertificates: {
            $sum: {
              $cond: [
                { $eq: ["$status", "revoked"] },
                1,
                0
              ]
            }
          },

          certificatesThisMonth: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", startOfMonth] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalCertificates: 0,
      validCertificates: 0,
      revokedCertificates: 0,
      certificatesThisMonth: 0
    };

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

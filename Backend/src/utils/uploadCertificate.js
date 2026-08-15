import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

const uploadCertificate = (pdfBuffer, certificateNumber) => {

    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                folder: "ngo-certificates",
                public_id: certificateNumber
            },
            (error, result) => {

                if (error) {
                    return reject(error);
                }

                resolve(result);

            }
        );

        Readable.from(pdfBuffer).pipe(uploadStream);

    });

};

export default uploadCertificate;
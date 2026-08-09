import PDFDocument from "pdfkit";

const generateCertificatePDF = ({
    volunteer,
    campaign,
    certificateNumber,
    hoursCompleted,
    issuedDate,
    verificationUrl,
    qrCode
}) => {

    return new Promise((resolve, reject) => {

        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        const buffers = [];

        doc.on("data", buffers.push.bind(buffers));

        doc.on("end", () => {
            resolve(Buffer.concat(buffers));
        });

        doc.on("error", reject);

        // Title
        doc
            .fontSize(24)
            .text("NGO Volunteer Management System", {
                align: "center"
            });

        doc.moveDown();

        doc
            .fontSize(20)
            .text("Certificate of Appreciation", {
                align: "center"
            });

        doc.moveDown(2);

        doc
            .fontSize(14)
            .text("This certificate is proudly presented to", {
                align: "center"
            });

        doc.moveDown();

        doc
            .fontSize(24)
            .text(`${volunteer.firstName} ${volunteer.lastName}`, {
                align: "center"
            });

        doc.moveDown();

        doc
            .fontSize(14)
            .text(
                `For successfully volunteering in "${campaign.title}"`,
                {
                    align: "center"
                }
            );

        doc.moveDown();

        doc.text(`Hours Completed: ${hoursCompleted}`, {
            align: "center"
        });

        doc.moveDown();

        doc.text(`Certificate Number: ${certificateNumber}`);

        doc.text(
            `Issued On: ${new Date(issuedDate).toLocaleDateString()}`
        );

        doc.moveDown(2);

        // QR Code Image
        doc.image(
            Buffer.from(qrCode.split(",")[1], "base64"),
            220,
            500,
            {
                width: 150
            }
        );

        doc.moveDown(8);

        doc.fontSize(10);

        doc.text("Verify Certificate:", {
            align: "center"
        });

        doc.text(verificationUrl, {
            align: "center"
        });

        doc.end();

    });

};

export default generateCertificatePDF;
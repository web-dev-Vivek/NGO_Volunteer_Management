import QRCode from "qrcode";

const generateQRCode = async (verificationUrl) => {
    try {
        const qrCode = await QRCode.toDataURL(verificationUrl);

        return qrCode;
    } catch (error) {
        throw new Error("Failed to generate QR Code");
    }
};

export default generateQRCode;
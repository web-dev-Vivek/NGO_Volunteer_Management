
import Certificate from "../models/Certificate.js";

const generateCertificateNumber = async () => {

    const totalCertificates = await Certificate.countDocuments();

    const nextNumber = totalCertificates + 1;

    const year = new Date().getFullYear();

    return `NGO-${year}-${String(nextNumber).padStart(6, "0")}`;
};

export default generateCertificateNumber;
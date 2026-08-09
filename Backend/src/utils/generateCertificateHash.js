import crypto from "crypto";

const generateCertificateHash = () => {

    return crypto
        .randomBytes(32)
        .toString("hex");

};

export default generateCertificateHash;
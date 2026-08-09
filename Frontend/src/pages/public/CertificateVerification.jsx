import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { verifyCertificate } from "../../api/certificateApi";

import VerificationCard from "../../components/certificate/VerificationCard";
import VerificationLoading from "../../components/certificate/VerificationLoading";
import VerificationError from "../../components/certificate/VerificationError";

const CertificateVerification = () => {

    const { hash } = useParams();

    const [certificate, setCertificate] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        const fetchCertificate = async () => {

            try {

                setLoading(true);

                const response =
                    await verifyCertificate(hash);

                setCertificate(response.data.data);

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Certificate verification failed."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchCertificate();

    }, [hash]);

    if (loading) {
        return <VerificationLoading />;
    }

    if (error) {
        return (
            <VerificationError
                message={error}
            />
        );
    }

    return (
        <VerificationCard
            certificate={certificate}
        />
    );

};

export default CertificateVerification;
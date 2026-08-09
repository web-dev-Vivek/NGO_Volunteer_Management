// Admin Certificate Dashboard

import React, { useEffect, useState } from "react";

import CertificateStatCard from "../../components/certificate/CertificateStatCard";
import CertificateTable from "../../components/certificate/CertificateTable";
import CertificateFilters from "../../components/certificate/CertificateFilters";
import Pagination from "../../components/certificate/Pagination";
import GenerateCertificateModal from "../../components/certificate/GenerateCertificateModal";
import { downloadCertificate, generateCertificate, getAllCertificates, getCertificateStats, revokeCertificate } from "../../api/certificateApi";

import RevokeCertificateModal from "../../components/certificate/RevokeCertificateModal";

const CertificateDashboard = () => {
  const [stats, setStats] = useState({
    totalCertificates: 0,
    validCertificates: 0,
    revokedCertificates: 0,
    certificatesThisMonth: 0,
  });


  const [isGenerateModalOpen, setIsGenerateModalOpen] =
useState(false);
  const [certificates, setCertificates] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCertificates, setLoadingCertificates] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);



  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);

const [selectedCertificateId, setSelectedCertificateId] = useState(null);


  const fetchStats = async () => {
    try {
      setLoadingStats(true);

      const response = await getCertificateStats();

      setStats(response.data.data);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to load statistics.");
    } finally {
      setLoadingStats(false);
    }
  };


  const fetchCertificates = async () => {
    try {
      setLoadingCertificates(true);

      const response = await getAllCertificates({
        page,
        limit,
        search,
        status,
      });

      setCertificates(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to load certificates.");
    } finally {
      setLoadingCertificates(false);
    }
  };

  // Download handler

  const handleDownload = async (certificateId) => {
  try {

    const response = await downloadCertificate(certificateId);

    window.open(response.data.downloadUrl, "_blank");

  } catch (error) {

    console.error(error);

    alert("Failed to download certificate.");

  }
};



// Open the revoke confirmation dialog.

const handleRevoke = (certificateId) => {
  setSelectedCertificateId(certificateId);
  setIsRevokeModalOpen(true);
};


// Revoke the selected certificate.

const handleConfirmRevoke = async (reason) => {
  try {

    await revokeCertificate(selectedCertificateId, reason);

    setIsRevokeModalOpen(false);

    setSelectedCertificateId(null);

    fetchCertificates();

    fetchStats();

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to revoke certificate."
    );

  }
};




// Create a certificate and refresh the dashboard.

const handleGenerateCertificate = async (formData) => {
  try {

    await generateCertificate(formData);

    alert("Certificate generated successfully.");

    setIsGenerateModalOpen(false);

    fetchCertificates();

    fetchStats();

  } catch (error) {

    console.error(error);

    throw error;

  }
};



  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };


  const handleStatus = (value) => {
    setStatus(value);
    setPage(1);
  };


  useEffect(() => {
    fetchStats();
  }, []);


  useEffect(() => {
    fetchCertificates();
  }, [page, search, status]);


  const statsCards = [
    {
      title: "Total Certificates",
      value: stats.totalCertificates,
    },
    {
      title: "Valid Certificates",
      value: stats.validCertificates,
    },
    {
      title: "Revoked Certificates",
      value: stats.revokedCertificates,
    },
    {
      title: "This Month",
      value: stats.certificatesThisMonth,
    },
  ];

  return (
    <main className="certificate-dashboard">


     <header className="certificate-dashboard__header">

    <div>

        <h1>
            Certificate Management
        </h1>

        <p>
            Manage certificates, generate new certificates, verify and revoke certificates.
        </p>

    </div>

  <button
    onClick={() => setIsGenerateModalOpen(true)}
    className="certificate-dashboard__primary-action"
>
    + Generate Certificate
</button>

</header>


      {error && (
        <div className="certificate-dashboard__error" role="alert">
          {error}
        </div>
      )}


      {loadingStats ? (
        <p className="certificate-dashboard__loading">
          Loading statistics...
        </p>
      ) : (
        <div className="certificate-dashboard__stats">
          {statsCards.map((card) => (
            <CertificateStatCard
              key={card.title}
              title={card.title}
              value={card.value}
            />
          ))}
        </div>
      )}


      <CertificateFilters
        search={search}
        setSearch={handleSearch}
        status={status}
        setStatus={handleStatus}
      />


      {loadingCertificates ? (
        <p className="certificate-dashboard__loading">
          Loading certificates...
        </p>
      ) : (
       <CertificateTable
    certificates={certificates}
    onDownload={handleDownload}
    onRevoke={handleRevoke}
    onView={(hash) => window.open(`/verify/${hash}`, "_blank", "noopener,noreferrer")}
/>
      )}


      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
      <RevokeCertificateModal
  isOpen={isRevokeModalOpen}
  onClose={() => {
    setIsRevokeModalOpen(false);
    setSelectedCertificateId(null);
  }}
  onConfirm={handleConfirmRevoke}
/>



<GenerateCertificateModal
    isOpen={isGenerateModalOpen}
    onClose={() => setIsGenerateModalOpen(false)}
    onGenerate={handleGenerateCertificate}
/>
    </main>
  );
};

export default CertificateDashboard;

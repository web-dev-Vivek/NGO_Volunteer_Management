const CertificateStatCard = ({ title, value }) => {
  return (
    <div className="certificate-stat-card">
      <h3>
        {title}
      </h3>

      <p>
        {value}
      </p>
    </div>
  );
};

export default CertificateStatCard;

const VerificationCard = ({ certificate }) => (
  <main className="verification-page">
    <section className="verification-card">
      <header className="verification-card__header"><span>Official record</span><h1>Certificate verified</h1><p>This certificate is authentic and successfully verified.</p></header>
      <div className="verification-card__body"><div className="verification-card__details"><Info title="Certificate Number" value={certificate.certificateNumber} /><Info title="Volunteer" value={`${certificate.volunteer?.firstName} ${certificate.volunteer?.lastName}`} /><Info title="Campaign" value={certificate.campaign?.title} /><Info title="Hours Completed" value={certificate.hoursCompleted} /><Info title="Issued Date" value={new Date(certificate.issuedDate).toLocaleDateString()} /><Info title="Issued By" value={`${certificate.issuedBy?.firstName} ${certificate.issuedBy?.lastName}`} /></div><div className="verification-card__action"><a href={certificate.certificateUrl} target="_blank" rel="noopener noreferrer" className="verification-card__download">Open certificate</a></div></div>
    </section>
  </main>
);
const Info = ({ title, value }) => <div className="verification-info"><p>{title}</p><strong>{value || "-"}</strong></div>;
export default VerificationCard;

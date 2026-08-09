const CertificateFilters = ({
  search,
  setSearch,
  status,
  setStatus,
}) => {
  return (
    <div className="certificate-filters">

      <input
        type="text"
        placeholder="Search certificate number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="certificate-filters__search"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="certificate-filters__select"
      >
        <option value="">All Status</option>
        <option value="valid">Valid</option>
        <option value="revoked">Revoked</option>
      </select>

    </div>
  );
};

export default CertificateFilters;

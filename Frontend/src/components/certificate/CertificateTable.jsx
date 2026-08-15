const CertificateTable = ({ certificates, onDownload, onRevoke, onView }) => {
  return (
    <div className="certificate-table-wrap">
      <table className="certificate-table">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left">Volunteer</th>
            <th className="px-6 py-3 text-left">Campaign</th>
            <th className="px-6 py-3 text-left">Hours</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Issued Date</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>

       <tbody>
  {certificates.map((certificate) => (
    <tr
      key={certificate._id}
      className="certificate-table__row"
    >
      <td className="px-6 py-4">
        {certificate.volunteerId.firstName}{" "}
        {certificate.volunteerId.lastName}
      </td>

      <td className="px-6 py-4">
        {certificate.campaignId.title}
      </td>

      <td className="px-6 py-4">
        {certificate.hoursCompleted}
      </td>

      <td className="px-6 py-4">

    <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
            certificate.status === "valid"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
        }`}
    >
        {certificate.status}
    </span>

</td>

      <td className="px-6 py-4">
      {new Date(certificate.issuedDate).toLocaleDateString("en-GB")}
      </td>
<td className="px-6 py-4">
    <div className="flex justify-center gap-2">

        <button
            type="button"
            onClick={() => onView(certificate.certificateHash)}
            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
            View
        </button>

        <button
            type="button"
            onClick={() => onDownload(certificate._id)}
            className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
        >
            Download
        </button>

       <button
  type="button"
  onClick={() => onRevoke(certificate._id)}
  disabled={certificate.status === "revoked"}
  className={`px-3 py-1 rounded text-white ${
    certificate.status === "revoked"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-red-500 hover:bg-red-600"
  }`}
>
  Revoke
</button>

    </div>
</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default CertificateTable;

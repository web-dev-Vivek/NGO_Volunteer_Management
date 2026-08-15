import React, { useState } from "react";

const RevokeCertificateModal = ({
  isOpen,
  onClose,
  onConfirm,
}) => {

  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {

    if (!reason.trim()) {
      alert("Please enter a revocation reason.");
      return;
    }

    onConfirm(reason);

    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl w-full max-w-md p-6">

        <h2 className="text-xl font-semibold mb-4">
          Revoke Certificate
        </h2>

        <p className="text-gray-500 mb-4">
          Please provide the reason for revoking this certificate.
        </p>

        <textarea
          rows="4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter revocation reason..."
          className="w-full border rounded-lg p-3 resize-none"
        />

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-red-600 text-white"
          >
            Revoke
          </button>

        </div>

      </div>

    </div>
  );
};

export default RevokeCertificateModal;
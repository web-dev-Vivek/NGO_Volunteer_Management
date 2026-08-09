import { useState } from "react";

const GenerateCertificateModal = ({ isOpen, onClose, onGenerate }) => {
  const [form, setForm] = useState({ campaignId: "", volunteerId: "", hoursCompleted: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  if (!isOpen) return null;
  const update = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }));
  const submit = async (event) => {
    event.preventDefault(); setError("");
    if (!form.campaignId || !form.volunteerId || Number(form.hoursCompleted) <= 0) { setError("Enter valid campaign and volunteer IDs, and hours greater than zero."); return; }
    setSubmitting(true);
    try { await onGenerate({ ...form, hoursCompleted: Number(form.hoursCompleted) }); setForm({ campaignId: "", volunteerId: "", hoursCompleted: "" }); }
    catch (requestError) { setError(requestError.response?.data?.message || "Certificate generation failed."); }
    finally { setSubmitting(false); }
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="certificate-modal-title"><form className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl" onSubmit={submit}><h2 id="certificate-modal-title" className="mb-2 text-2xl font-bold">Issue certificate</h2><p className="mb-6 text-sm text-gray-500">Enter the completed campaign and eligible volunteer identifiers.</p>{error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}{[["campaignId", "Campaign ID"], ["volunteerId", "Volunteer ID"]].map(([name, label]) => <label key={name} className="mb-4 block text-sm font-medium">{label}<input required name={name} value={form[name]} onChange={update} className="mt-2 w-full rounded-lg border p-3" /></label>)}<label className="mb-6 block text-sm font-medium">Hours completed<input required name="hoursCompleted" type="number" min="0.25" step="0.25" value={form.hoursCompleted} onChange={update} className="mt-2 w-full rounded-lg border p-3" /></label><div className="flex justify-end gap-3"><button type="button" onClick={onClose} disabled={submitting} className="rounded-lg border px-5 py-2">Cancel</button><button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50">{submitting ? "Issuing…" : "Issue certificate"}</button></div></form></div>;
};
export default GenerateCertificateModal;

import { useEffect, useState } from "react";
import { getMyProfile, updateProfile, uploadAvatar } from "../../api/profileApi";
import ProfileAvatar from "../../components/profile/ProfileAvatar";
import ProfileForm from "../../components/profile/ProfileForm";
import ProfileLoading from "../../components/profile/ProfileLoading";

const emptyProfile = { firstName: "", lastName: "", email: "", phone: "", skills: "", bio: "", avatar: "" };

const Profile = () => {
  const [formData, setFormData] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await getMyProfile();
        const user = data.data;
        setFormData({ firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "", phone: user.phone || "", skills: (user.skills || []).join(", "), bio: user.bio || "", avatar: user.profileImage || "" });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load your profile.");
      } finally { setLoading(false); }
    };
    loadProfile();
  }, []);

  const handleChange = ({ target }) => setFormData((current) => ({ ...current, [target.name]: target.value }));
  const handleAvatarChange = async ({ target }) => {
    const file = target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { setError("Choose an image smaller than 5 MB."); return; }
    setUploading(true); setError(""); setMessage("");
    try {
      const payload = new FormData(); payload.append("avatar", file);
      const { data } = await uploadAvatar(payload);
      setFormData((current) => ({ ...current, avatar: data.data.profileImage }));
      setMessage("Profile photo updated.");
    } catch (requestError) { setError(requestError.response?.data?.message || "Avatar upload failed."); }
    finally { setUploading(false); target.value = ""; }
  };
  const handleSubmit = async (event) => {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    try {
      const { data } = await updateProfile({ firstName: formData.firstName, lastName: formData.lastName, phone: formData.phone, bio: formData.bio, skills: formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean) });
      setFormData((current) => ({ ...current, ...data.data, skills: (data.data.skills || []).join(", "), avatar: data.data.profileImage || current.avatar }));
      setMessage("Profile saved successfully.");
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to save your profile."); }
    finally { setSaving(false); }
  };
  if (loading) return <ProfileLoading />;
  return <main className="profile-page"><section className="profile-page__header"><div><p>Personal workspace</p><h1>Your profile</h1><span>Keep your contact details and volunteer skills up to date.</span></div></section>{error && <div className="profile-alert profile-alert--error" role="alert">{error}</div>}{message && <div className="profile-alert profile-alert--success" role="status">{message}</div>}<section className="profile-card"><ProfileAvatar avatar={formData.avatar} firstName={formData.firstName} lastName={formData.lastName} onAvatarChange={handleAvatarChange} uploading={uploading} /><ProfileForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} loading={saving} /></section></main>;
};
export default Profile;

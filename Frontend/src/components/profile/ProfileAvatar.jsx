const ProfileAvatar = ({
    avatar,
    firstName,
    lastName,
    onAvatarChange,
    uploading
}) => {

    return (

        <aside className="profile-avatar">

         <img
    src={
        avatar ||
        `https://placehold.co/150x150?text=${encodeURIComponent(firstName?.[0] || "A")}`
    }
    alt={`${firstName} ${lastName}`.trim() || "Profile"}
    className="profile-avatar__image"
/>

            <h2 className="profile-avatar__name">
                {firstName} {lastName}
            </h2>

            <label className="profile-avatar__upload">

                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={onAvatarChange}
                />

               <span>

    {uploading ? "Uploading..." : "Change Photo"}

</span>

            </label>

        </aside>

    );
};

export default ProfileAvatar;

const ProfileForm = ({
    formData,
    handleChange,
    handleSubmit,
    loading
}) => {

    return (

        <form
            onSubmit={handleSubmit}
            className="profile-form"
        >

            <div>

                <label className="block mb-2 font-medium">

                    First Name

                </label>

                <input className="profile-form__input"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                />

            </div>

            <div>

                <label className="block mb-2 font-medium">

                    Last Name

                </label>

                <input className="profile-form__input"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                />

            </div>

            <div>

                <label className="block mb-2 font-medium">

                    Email

                </label>

                <input className="profile-form__input"
                    type="email"
                    value={formData.email}
                    readOnly
                />

            </div>

            <div>

                <label className="block mb-2 font-medium">

                    Phone

                </label>

                <input className="profile-form__input"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />

            </div>

            <div>

                <label className="block mb-2 font-medium">

                    Address

                </label>

                <input className="profile-form__input"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />

            </div>

            <div>

                <label className="block mb-2 font-medium">

                    Skills

                </label>

                <input className="profile-form__input"
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, First Aid"
                />

            </div>

            <div>

                <label className="block mb-2 font-medium">

                    Bio

                </label>

                <textarea className="profile-form__input profile-form__textarea"
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                />

            </div>

            <button
                type="submit"
                disabled={loading}
                className="profile-form__submit"
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>

        </form>

    );

};

export default ProfileForm;

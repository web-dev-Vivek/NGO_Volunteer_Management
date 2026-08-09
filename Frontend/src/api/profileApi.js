import axiosInstance from "./axiosInstance";

// Current user profile
export const getMyProfile = () => {
    return axiosInstance.get("/auth/me");
};

export const updateProfile = (profileData) => {
    return axiosInstance.put(
        "/auth/profile",
        profileData
    );
};

export const uploadAvatar = (formData) => {
    return axiosInstance.post(
        "/auth/profile/avatar",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};

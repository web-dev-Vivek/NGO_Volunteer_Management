import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const getCertificateStats = () =>
    API.get("/certificates/stats");

export const getAllCertificates = (params) =>
    API.get("/certificates", { params });

export const generateCertificate = (data) =>
    API.post("/certificates", data);

export const revokeCertificate = (id, reason) =>
    API.put(`/certificates/${id}/revoke`, { reason });

export const downloadCertificate = (id) =>
    API.get(`/certificates/download/${id}`);

export const getMyCertificates = () =>
    API.get("/certificates/my-certificates");

export const verifyCertificate = (hash) =>
    API.get(`/certificates/verify/${hash}`);

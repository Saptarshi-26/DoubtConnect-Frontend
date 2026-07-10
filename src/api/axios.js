import axios from "axios";

const api = axios.create({
 baseURL: "https://doubtconnect-backend.onrender.com",
  //baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (
    token &&
    config.url !== "/google/verify" &&
    !config.url.startsWith("/auth/")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
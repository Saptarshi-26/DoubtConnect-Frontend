import axios from "axios";

const api = axios.create({
  
//baseURL: "https://doubtconnect-backend.onrender.com", // render 
 baseURL: "http://localhost:8080",
   //baseURL: "https://doubtconnectbackend-nk9c1w2j.b4a.run",
 //baseURL: "http://13.201.19.80:8080",
 
 //baseURL: "https://doubtconnect.duckdns.org",
});
console.log("Axios file loaded");
console.log("Base URL =", api.defaults.baseURL);

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
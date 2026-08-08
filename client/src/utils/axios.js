import axios from "axios";

const api = axios.create({
  baseURL: "https://eventoraa-ibri.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default api;

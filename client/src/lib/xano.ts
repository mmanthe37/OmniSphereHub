import axios from "axios";

export const xano = axios.create({
  baseURL: "https://x8ki-letl-twmt.n7.xano.io/api:Lj5ehXrx",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_XANO_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

xano.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) window.location.href = "/login";
    return Promise.reject(err);
  },
);

export default xano;
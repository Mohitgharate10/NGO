const envUrl = import.meta.env.VITE_API_URL;
export const API = (envUrl !== undefined && envUrl !== null)
  ? envUrl
  : (import.meta.env.PROD ? "" : "http://localhost:5000");

export default API;

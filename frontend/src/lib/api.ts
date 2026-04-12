import axios from "axios"

// In Docker/Production, we might want to use relative paths if Nginx proxies everything
// In Development, we use the explicit backend URL
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment 
  ? "http://localhost:8000/api/v1" 
  : "/api/v1";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || baseURL,
})

export default api

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://wordladder-production-0001.up.railway.app"
    : "http://localhost:8000"; 
    
export default API_URL;

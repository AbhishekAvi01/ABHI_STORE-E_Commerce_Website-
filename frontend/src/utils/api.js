import axios from 'axios';

const api = axios.create({
  // Backend ka Base URL - uses environment variable for production
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Request Interceptor: Har request ke saath token bhejne ke liye
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

  if (userInfo && userInfo.token) {
    // Agar user login hai, toh Header mein Token add karein
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
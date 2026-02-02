// src/utils/getApiUrl.js

// Returns the correct API base URL depending on environment
// For LOCAL development: Returns '/api' (Vite proxy will route to localhost:5000)
// For PRODUCTION: Returns VITE_API_URL from environment
export default function getApiUrl() {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || '/api';
  }
  // Local development - Vite proxy will handle /api routing
  return '/api';
}

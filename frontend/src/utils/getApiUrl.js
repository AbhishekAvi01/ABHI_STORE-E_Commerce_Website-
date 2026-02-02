// src/utils/getApiUrl.js

// Returns the correct API base URL depending on environment
// For LOCAL development: Returns '/api' (Vite proxy will route to localhost:5000)
// For PRODUCTION: Returns VITE_API_URL from environment
export default function getApiUrl() {
  if (import.meta.env.PROD) {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    // Ensure the URL ends with /api if it's a full URL
    if (apiUrl.startsWith('http')) {
      return apiUrl.endsWith('/api') ? apiUrl : apiUrl + '/api';
    }
    return apiUrl;
  }
  // Local development - Vite proxy will handle /api routing
  return '/api';
}

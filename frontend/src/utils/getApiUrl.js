// src/utils/getApiUrl.js

// Returns the correct API base URL depending on environment
export default function getApiUrl() {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || '/api';
  }
  return '';
}

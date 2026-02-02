import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


// Use full backend URL in production, '' (proxy) in development
const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    // Change this to your deployed backend URL
    return import.meta.env.VITE_API_URL || '/api';
  }
  return '';
};

const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  prepareHeaders: (headers, { getState }) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.token) {
        headers.set('Authorization', `Bearer ${user.token}`);
      }
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});




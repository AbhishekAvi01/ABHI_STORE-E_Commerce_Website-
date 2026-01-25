import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base URL empty rakhein kyunki package.json mein proxy use ho rahi hai
const baseQuery = fetchBaseQuery({ 
  baseUrl: '',
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




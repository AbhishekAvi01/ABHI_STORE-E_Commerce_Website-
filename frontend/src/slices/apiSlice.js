import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base URL empty rakhein kyunki package.json mein proxy use ho rahi hai
const baseQuery = fetchBaseQuery({ baseUrl: '' });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});




import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: '/api/orders',
        method: 'POST',
        body: { ...order },
      }),
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: '/api/orders/myorders',
        method: 'GET',
      }),
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `/api/orders/${id}`,
        method: 'GET',
      }),
    }),
    updateOrderToDelivered: builder.mutation({
      query: (id) => ({
        url: `/api/orders/${id}/deliver`,
        method: 'PUT',
      }),
    }),
  }),
});

export const { 
  useCreateOrderMutation, 
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderToDeliveredMutation 
} = ordersApiSlice;
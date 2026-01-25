import { createSlice } from '@reduxjs/toolkit';

// Numbers ko 2 decimal places tak fix karne ke liye
const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const updateCart = (state) => {
  // 1. Items Price Calculate karein
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // 2. Shipping Price (₹1000 ke upar free, varna ₹100)
  state.shippingPrice = addDecimals(state.itemsPrice > 1000 ? 0 : 100);

  // 3. Tax Price (15% GST)
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

  // 4. Total Price Calculate karein
  state.totalPrice = addDecimals(
    Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice)
  );

  localStorage.setItem('cart', JSON.stringify(state));
  return state;
};

// Initial State with Defaults
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { 
      cartItems: [], 
      shippingAddress: {}, 
      paymentMethod: 'PayPal', 
      itemsPrice: 0, 
      shippingPrice: 0, 
      taxPrice: 0, 
      totalPrice: 0 
    };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
      return updateCart(state);
    },
  },
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems } = cartSlice.actions;
export default cartSlice.reducer;
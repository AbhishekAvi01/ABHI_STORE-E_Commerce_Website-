import { createSlice } from '@reduxjs/toolkit';

// Local storage se user info uthana takki refresh par data na jaye
const initialState = {
  userInfo: localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
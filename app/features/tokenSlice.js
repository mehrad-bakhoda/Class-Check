import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: {
    accessToken: null,
    user: {},
  },
};
const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.value.accessToken = action.payload;
    },
    removeAccessToken: (state) => {
      state.value.accessToken = null;
    },
    setUser: (state, action) => {
      state.value.user = action.payload;
    },
    removeUser: (state) => {
      state.value.user = null;
    },
  },
});

export const { setAccessToken, removeAccessToken, setUser, removeUser } =
  tokenSlice.actions;
export default tokenSlice.reducer;

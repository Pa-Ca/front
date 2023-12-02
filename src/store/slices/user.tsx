import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  logged: boolean;
}

const initialState: UserState = {
  logged: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state) => {
      state.logged = true;
    },
    logout: (state) => {
      state.logged = false;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;

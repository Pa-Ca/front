import { UserInterface } from "@objects";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  logged: boolean;
  token?: string;
  refresh?: string;
  user?: UserInterface;
}

const initialState: AuthState = {
  logged: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLogin: (state, action: PayloadAction<AuthState>) => {
      state.logged = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refresh = action.payload.refresh;
    },
    authLogout: (state) => {
      state.logged = false;
      state.user = undefined;
      state.token = undefined;
      state.refresh = undefined;
    },
  },
});

export const { authLogin, authLogout } = authSlice.actions;

export default authSlice.reducer;

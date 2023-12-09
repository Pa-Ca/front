import { ClientInterface } from "@objects";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: Partial<ClientInterface> = {};

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClient: (state, action: PayloadAction<ClientInterface>) => {
      state.id = action.payload.id;
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.surname = action.payload.surname;
      state.stripeCustomerId = action.payload.stripeCustomerId;
      state.phoneNumber = action.payload.phoneNumber;
      state.address = action.payload.address;
      state.dateOfBirth = action.payload.dateOfBirth;
    },
    unsetClient: (state) => {
      state.id = undefined;
      state.userId = undefined;
      state.name = undefined;
      state.surname = undefined;
      state.stripeCustomerId = undefined;
      state.phoneNumber = undefined;
      state.address = undefined;
      state.dateOfBirth = undefined;
    },
  },
});

export const { setClient, unsetClient } = clientSlice.actions;

export default clientSlice.reducer;

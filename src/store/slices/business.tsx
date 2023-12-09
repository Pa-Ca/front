import { BusinessInterface } from "@objects";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: Partial<BusinessInterface> = {};

export const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setBusiness: (state, action: PayloadAction<BusinessInterface>) => {
      state.id = action.payload.id;
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.tier = action.payload.tier;
      state.verified = action.payload.verified;
      state.phoneNumber = action.payload.phoneNumber;
    },
    unsetBusiness: (state) => {
      state.id = undefined;
      state.userId = undefined;
      state.name = undefined;
      state.tier = undefined;
      state.verified = undefined;
      state.phoneNumber = undefined;
    },
  },
});

export const { setBusiness, unsetBusiness } = businessSlice.actions;

export default businessSlice.reducer;

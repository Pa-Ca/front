import { BusinessInterface } from "@objects";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface BusinessState {
  data?: BusinessInterface;
}
const initialState: BusinessState = {};

export const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setBusiness: (state, action: PayloadAction<BusinessInterface>) => {
      state.data = action.payload;
    },
    unsetBusiness: (state) => {
      state.data = undefined;
    },
  },
});

export const { setBusiness, unsetBusiness } = businessSlice.actions;

export default businessSlice.reducer;

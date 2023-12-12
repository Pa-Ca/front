import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BranchInterface } from "src/objects/BranchInterface";

interface BranchesState {
  list: BranchInterface[];
  selected?: BranchInterface;
}

const initialState: BranchesState = {
  list: [],
};

export const branchesSlice = createSlice({
  name: "branches",
  initialState,
  reducers: {
    setBranches: (state, action: PayloadAction<BranchInterface[]>) => {
      state.list = action.payload;
      state.selected = action.payload[0] || undefined;
    },
    setBranchSelected: (state, action: PayloadAction<BranchInterface>) => {
      state.selected = action.payload;
    },
    unsetBranches: (state) => {
      state.list = [];
      state.selected = undefined;
    },
  },
});

export const { setBranches, setBranchSelected, unsetBranches } = branchesSlice.actions;

export default branchesSlice.reducer;

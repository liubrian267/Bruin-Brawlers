import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface searchOptionState {
  option: string;
}

const initialState: searchOptionState = {
  option: "friends",
};


export const searchOptionSlice = createSlice({
  name: 'searchOption',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<string>) => {
      state.option = action.payload;
    },
  },
});

export const { setValue } = searchOptionSlice.actions;
export default searchOptionSlice.reducer;
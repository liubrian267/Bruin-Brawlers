import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPayloadState } from '@/types/Users';


const initialState: UserPayloadState = {
  brawlID: '',
  _id: '',
  name: '',
  email: '',
};

const userPayloadSlice = createSlice({
  name: 'userPayload',
  initialState,
  reducers: {
    setUserPayload: (state, action: PayloadAction<UserPayloadState>) => {
      state.brawlID = action.payload.brawlID;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    clearUserPayload: (state) => {
      state.brawlID = '';
      state.name = '';
      state.email = '';
    },
  },
});

export const { setUserPayload, clearUserPayload } = userPayloadSlice.actions;
export default userPayloadSlice.reducer;
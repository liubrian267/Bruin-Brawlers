import { configureStore } from '@reduxjs/toolkit';
import searchOptionSliceReducer from '@/features/searchOptions/searchOptions.slice';
import userPayloadSliceReducer from '@/features/userPayload/userPayload.slice';

export const store = configureStore({
  reducer: {
    searchOption: searchOptionSliceReducer,
    userPayload: userPayloadSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
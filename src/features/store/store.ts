import { configureStore } from '@reduxjs/toolkit';

import counterReducer from '@/features/counter/counterSlice';

import subjectsSlice from '@/features/slices/subjectsSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      subjects: subjectsSlice,
    },
  });
};

// Типизация для использования в приложении
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

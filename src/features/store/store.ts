import { configureStore } from '@reduxjs/toolkit';

import counterReducer from '@/features/counter/counterSlice';

import subjectsSlice from '@/features/slices/subjectsSlice'

import proctorResultSlice from '@/shared/slices/proctorResultSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      subjects: subjectsSlice,
      proctorResult: proctorResultSlice,
    },
  });
};

// Типизация для использования в приложении
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

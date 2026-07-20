import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit'

import type { TestItem } from '@/types/subjects/TestItem'

interface SubjectSliceType {
  value: TestItem[];
}

const initialState: SubjectSliceType = {
  value: [],
};

export const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    subjectSet: (state, action: PayloadAction<TestItem[]>) => {
      state.value = action.payload;
    },
  },
});

export const { subjectSet } = subjectsSlice.actions;
export default subjectsSlice.reducer;

import { ProctorType } from '@/types/proctor/proctorType';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: {value: ProctorType | null} = {
    value: {
        gallery: [],
        stats: {
            lookingAwayCount: 0,
            noFaceCount: 0,
            multipleFacesCount: 0,
            totalViolations: 0,
            honestyIndex: 0,
        }
    }
};

export const proctorResult = createSlice({
    name: 'proctorResult',
    initialState,
    reducers: { 
        addProctorResult: (state, action) => {
            console.log(action.payload);
            state.value = action.payload;
        },
        clearProctorResult: (state) => {
            state.value = null;
        }
    },
});

export const { addProctorResult, clearProctorResult } = proctorResult.actions;
export default proctorResult.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: {},
    singleData: {},
    singleDataId: null
};

const databaseSlice = createSlice({
    name: 'database',
    initialState,
    reducers: {
        storeData (state, action) { 
            const data = action.payload;
            state.data = data;
        },
        storeSingleData (state, action) {
            state.singleData = action.payload;
            state.singleDataId = action.payload && action.payload[0] ? action.payload[0].$id : null;
        }
    }
});

export const { storeData, storeSingleData } = databaseSlice.actions;
export default databaseSlice.reducer;

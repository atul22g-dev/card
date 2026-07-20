import { createAsyncThunk,createSlice } from '@reduxjs/toolkit';

// Fetch Data
export const fetchDetails = createAsyncThunk(
    'details/fetchDetails',
    async () => {
        try {
            const response = await fetch('data/details.json');
            if (!response.ok) {
                throw new Error('Failed to fetch details');
            }
            const details = await response.json();
            return details;
        } catch (error) {
            throw error;
        }
    },
    {
        condition: (_, { getState }) => {
            const { details } = getState();
            return details.details.length === 0;
        },
    }
);
// Detail Silce
const detailSlice = createSlice({
    name: 'details',
    initialState: {
        loading: false,
        details: [],
        error: '',
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchDetails.pending, state => {
                state.loading = true;
            })
            .addCase(fetchDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.details = action.payload;
                state.error = '';
            })
            .addCase(fetchDetails.rejected, (state, action) => {
                state.loading = false;
                state.details = [];
                state.error = action.error.message;
            });
    },
});

export default detailSlice.reducer;

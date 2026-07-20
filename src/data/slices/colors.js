import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Fetch Data
export const fetchColors = createAsyncThunk(
    'colors/fetchColors',
    async () => {
        try {
            const response = await fetch('data/colors.json');
            if (!response.ok) {
                throw new Error('Failed to fetch colors');
            }
            const colors = await response.json();
            return colors;
        } catch (error) {
            throw error;
        }
    },
    {
        condition: (_, { getState }) => {
            const { colors } = getState();
            return colors.colors.length === 0;
        },
    }
);
// Colors Slice
const colorSlice = createSlice({
    name: 'colors',
    initialState: {
        loading: false,
        color: '244, 90, 87',
        colors: [],
        error: '',
    },
    reducers: {
        setCurrentColor(state, action) {
            state.color = action.payload;
            state.name = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchColors.pending, state => {
                state.loading = true;
            })
            .addCase(fetchColors.fulfilled, (state, action) => {
                state.loading = false;
                state.colors = action.payload;
                state.error = '';
            })
            .addCase(fetchColors.rejected, (state, action) => {
                state.loading = false;
                state.colors = [];
                state.error = action.error.message;
            });
    },
});

export const { setCurrentColor } = colorSlice.actions;
export default colorSlice.reducer;

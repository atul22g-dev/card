import { configureStore } from "@reduxjs/toolkit";
import colorsSlice from "./slices/colors";
import detailSlice from "./slices/detailSlice";
import dataSlice from "./slices/dataSlice";
import authSlice from "./slices/authSlice";
import databaseSlice from "./slices/databaseSlice";

const store = configureStore({
    reducer: {
        colors: colorsSlice,
        details: detailSlice,
        data: dataSlice,
        auth: authSlice,
        database: databaseSlice
    },
});

export default store;

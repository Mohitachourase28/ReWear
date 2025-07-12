import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/authSlice.js';
import adminReducer from '../redux/adminSlice.js';
import itemReducer from "../redux/itemSlice.js";
import productReducer from "../redux/productSlice.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        admin: adminReducer,
        item: itemReducer,
        products: productReducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['item/setImages'], // example
        ignoredPaths: ['item.images'],
      },
    }),
})

export default store;
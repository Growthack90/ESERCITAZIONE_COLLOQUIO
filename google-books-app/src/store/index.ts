import { configureStore } from "@reduxjs/toolkit";
import { booksApi } from "../services/booksApi";
import bookReducer from "./bookSlice";

export const store = configureStore({
  reducer: {
    booksUi: bookReducer,
    [booksApi.reducerPath]: booksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

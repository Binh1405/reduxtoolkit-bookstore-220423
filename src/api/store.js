import { combineReducers, configureStore } from "@reduxjs/toolkit";
import bookSliceReducer from "../pages/bookReducer";

export const store = configureStore({
  reducer: combineReducers({
    book: bookSliceReducer,
  }),
});

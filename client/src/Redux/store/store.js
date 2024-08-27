import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../reducers/cartSlice";
import { loadState, saveState } from "../utils/localStorage";

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: {
    cart: preloadedState || undefined,
  },
});

store.subscribe(() => {
  saveState(store.getState().cart);
});

export default store;

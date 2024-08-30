// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';

// Create the Redux store using configureStore
const store = configureStore({
  reducer: {
    user: userReducer,
    // other reducers can be added here
  },
  // middleware and devTools options can also be configured here
});

export default store;

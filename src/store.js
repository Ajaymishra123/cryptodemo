import { configureStore } from '@reduxjs/toolkit';
    import cryptoReducer from './features/crypto/cryptoSlice';

    const store = configureStore({
      reducer: {
        crypto: cryptoReducer,
      },
    });

    export default store;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
    import axios from 'axios';

    const initialState = {
      coins: [],
      status: 'idle',
      error: null,
      selectedCoin: null,
      selectedCoinStatus: 'idle',
      selectedCoinError: null,
    };

    export const fetchCoins = createAsyncThunk('crypto/fetchCoins', async () => {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h');
      return response.data;
    });

    export const fetchCoinDetails = createAsyncThunk('crypto/fetchCoinDetails', async (id) => {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
      return response.data;
    });

    const cryptoSlice = createSlice({
      name: 'crypto',
      initialState,
      reducers: {},
      extraReducers: (builder) => {
        builder
          .addCase(fetchCoins.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchCoins.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.coins = action.payload;
          })
          .addCase(fetchCoins.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
          .addCase(fetchCoinDetails.pending, (state) => {
            state.selectedCoinStatus = 'loading';
          })
          .addCase(fetchCoinDetails.fulfilled, (state, action) => {
            state.selectedCoinStatus = 'succeeded';
            state.selectedCoin = action.payload;
          })
          .addCase(fetchCoinDetails.rejected, (state, action) => {
            state.selectedCoinStatus = 'failed';
            state.selectedCoinError = action.error.message;
          });
      },
    });

    export default cryptoSlice.reducer;

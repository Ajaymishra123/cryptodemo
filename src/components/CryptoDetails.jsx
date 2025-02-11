import React, { useEffect, useState } from 'react';
    import { useDispatch, useSelector } from 'react-redux';
    import { useParams, useNavigate } from 'react-router-dom';
    import { fetchCoinDetails } from '../features/crypto/cryptoSlice';
    import { Line } from 'react-chartjs-2';
    import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
    import './CryptoDetails.css';

    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );

    const CryptoDetails = () => {
      const { id } = useParams();
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const { selectedCoin, selectedCoinStatus, selectedCoinError } = useSelector(
        (state) => state.crypto
      );
      const [historicalData, setHistoricalData] = useState(null);
      const [chartStatus, setChartStatus] = useState('idle');
      const [chartError, setChartError] = useState(null);

      useEffect(() => {
        dispatch(fetchCoinDetails(id));
        fetchHistoricalChartData(id);
      }, [dispatch, id]);

      const fetchHistoricalChartData = async (coinId) => {
        setChartStatus('loading');
        try {
          const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setHistoricalData(data);
          setChartStatus('succeeded');
        } catch (error) {
          console.error("Could not fetch historical data:", error);
          setChartError(error.message);
          setChartStatus('failed');
        }
      };


      const handleBackClick = () => {
        navigate('/');
      };

      if (selectedCoinStatus === 'loading' || chartStatus === 'loading') {
        return <div className="loading">Loading...</div>;
      }

      if (selectedCoinStatus === 'failed') {
        return <div className="error">Error: {selectedCoinError}</div>;
      }
      if (chartStatus === 'failed') {
        return <div className="error">Error loading chart: {chartError}</div>;
      }


      if (!selectedCoin || !historicalData) {
        return <div>Coin data or chart data not found.</div>;
      }

      const chartData = {
        labels: historicalData.prices.map(price => {
          const date = new Date(price[0]);
          return date.toLocaleDateString();
        }),
        datasets: [
          {
            label: `${selectedCoin.name} Price (USD)`,
            data: historicalData.prices.map(price => price[1]),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
        ],
      };

      const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `${selectedCoin.name} Price Chart (Last 30 Days)`
          },
        },
      };


      return (
        <div className="crypto-details">
          <button onClick={handleBackClick} className="back-button">Back to List</button>
          <h2>{selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})</h2>
          <div className="chart-container">
            <Line options={chartOptions} data={chartData} />
          </div>
          <div className="details-info">
            <p>Market Cap: ${selectedCoin.market_data.market_cap.usd.toLocaleString()}</p>
            <p>Current Price: ${selectedCoin.market_data.current_price.usd.toFixed(2)}</p>
            <p>24h High: ${selectedCoin.market_data.high_24h.usd.toFixed(2)}</p>
            <p>24h Low: ${selectedCoin.market_data.low_24h.usd.toFixed(2)}</p>
            <p>
              24h Change:{' '}
              <span
                className={
                  selectedCoin.market_data.price_change_percentage_24h > 0 ? 'positive' : 'negative'
                }
              >
                {selectedCoin.market_data.price_change_percentage_24h.toFixed(2)}%
              </span>
            </p>
            <p>Circulating Supply: {selectedCoin.market_data.circulating_supply.toLocaleString()}</p>
            <p>Total Supply: {selectedCoin.market_data.total_supply?.toLocaleString() || 'N/A'}</p>
            <p>Trading Volume: {selectedCoin.market_data.total_volume.usd.toLocaleString()}</p>
          </div>
        </div>
      );
    };

    export default CryptoDetails;

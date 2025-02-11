import React, { useEffect, useState } from 'react';
    import { useDispatch, useSelector } from 'react-redux';
    import { fetchCoins } from '../features/crypto/cryptoSlice';
    import { Link } from 'react-router-dom';
    import './CryptoList.css';

    const CryptoList = () => {
      const dispatch = useDispatch();
      const { coins, status, error } = useSelector((state) => state.crypto);
      const [searchTerm, setSearchTerm] = useState('');
      const [filter, setFilter] = useState('market_cap_desc');

      useEffect(() => {
        if (status === 'idle') {
          dispatch(fetchCoins());
        }

        const intervalId = setInterval(() => {
          dispatch(fetchCoins());
        }, 60000); // Refresh every 60 seconds

        return () => clearInterval(intervalId); // Clear interval on component unmount

      }, [status, dispatch]);

      const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
      };

      const handleFilterChange = (e) => {
        setFilter(e.target.value);
      };

      const filteredCoins = coins
        .filter((coin) =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          if (filter === 'market_cap_desc') {
            return b.market_cap - a.market_cap;
          } else if (filter === 'price_change_24h') {
            return b.price_change_percentage_24h - a.price_change_percentage_24h;
          }
          return 0;
        });


      if (status === 'loading') {
        return <div className="loading">Loading...</div>;
      }

      if (status === 'failed') {
        return <div className="error">Error: {error}</div>;
      }

      return (
        <div>
          <div className="controls">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <select onChange={handleFilterChange} value={filter} className="filter-select">
              <option value="market_cap_desc">Market Cap (High to Low)</option>
              <option value="price_change_24h">24h Change (High to Low)</option>
            </select>
          </div>
          <div className="crypto-list">
            {filteredCoins.map((coin) => (
              <Link to={`/details/${coin.id}`} key={coin.id} className="crypto-card">
                <img src={coin.image} alt={coin.name} />
                <h3>{coin.name} ({coin.symbol.toUpperCase()})</h3>
                <p>Price: ${coin.current_price.toFixed(2)}</p>
                <p>Market Cap: ${coin.market_cap.toLocaleString()}</p>
                <p
                  className={coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'}
                >
                  24h Change: {coin.price_change_percentage_24h.toFixed(2)}%
                </p>
              </Link>
            ))}
          </div>
        </div>
      );
    };

    export default CryptoList;

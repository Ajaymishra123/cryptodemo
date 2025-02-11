import React from 'react';
    import { Routes, Route } from 'react-router-dom';
    import CryptoList from './components/CryptoList';
    import CryptoDetails from './components/CryptoDetails';

    function App() {
      return (
        <div className="container">
          <h1>Cryptocurrency Dashboard</h1>
          <Routes>
            <Route path="/" element={<CryptoList />} />
            <Route path="/details/:id" element={<CryptoDetails />} />
          </Routes>
        </div>
      );
    }

    export default App;

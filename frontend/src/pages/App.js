import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';

function App() {
  return (
    <DataProvider>
      <nav style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        background: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <Link 
          to="/" 
          style={{
            color: '#9333ea',
            textDecoration: 'none',
            fontSize: '20px',
            fontWeight: '600',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#7c3aed'}
          onMouseLeave={(e) => e.target.style.color = '#9333ea'}
        >
          Items
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </DataProvider>
  );
}

export default App;
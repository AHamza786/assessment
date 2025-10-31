import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchItems = useCallback(async (options) => {
    const { page = 1, pageSize = 20, q = '', signal } = options || {};
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    if (q) params.set('q', q);

    const res = await fetch(`http://localhost:5000/api/items?${params.toString()}`, { signal });
    const json = await res.json();
    
    // Get total count from header (case-insensitive)
    let totalHeader = res.headers.get('x-total-count') || res.headers.get('X-Total-Count');
    
    if (totalHeader) {
      const totalCount = parseInt(totalHeader, 10);
      if (!isNaN(totalCount)) {
        setTotal(totalCount);
      } else {
        // Fallback: if header parsing fails, use items length for non-search queries
        setTotal(q ? json.length : json.length);
      }
    } else {
      // If no header (shouldn't happen with proper CORS), use items length
      // For search queries, this is correct. For regular pagination, this will be wrong
      // but we'll handle it by fetching all items count
      if (!q) {
        // Try to get total by fetching with a small pageSize to get the header
        try {
          const countRes = await fetch(`http://localhost:5000/api/items?page=1&pageSize=1`, { signal });
          const countHeader = countRes.headers.get('x-total-count') || countRes.headers.get('X-Total-Count');
          if (countHeader) {
            const totalCount = parseInt(countHeader, 10);
            if (!isNaN(totalCount)) {
              setTotal(totalCount);
            } else {
              setTotal(json.length);
            }
          } else {
            setTotal(json.length);
          }
        } catch {
          setTotal(json.length);
        }
      } else {
        setTotal(json.length);
      }
    }
    
    setItems(json);
  }, []);

  return (
    <DataContext.Provider value={{ items, total, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
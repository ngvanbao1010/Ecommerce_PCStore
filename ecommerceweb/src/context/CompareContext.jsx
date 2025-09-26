import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CompareContext = createContext();
const STORAGE_KEY = 'compareProducts';

export const CompareProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  });
  const [categoryId, setCategoryId] = useState(null); 
  const MAX_ITEMS = 4;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = useCallback((product) => {
    if (!product) return { ok: false, reason: 'invalid' };
    if (items.find(p => p.id === product.id)) {
      setItems(prev => prev.filter(p => p.id !== product.id));
      if (items.length === 1) setCategoryId(null);
      return { ok: true, removed: true };
    }
    if (items.length >= MAX_ITEMS) {
      return { ok: false, reason: 'limit' };
    }
    if (categoryId && product.category !== categoryId) {
      return { ok: false, reason: 'category' };
    }
    setItems(prev => [...prev, product]);
    if (!categoryId) setCategoryId(product.category);
    return { ok: true };
  }, [items, categoryId]);

  const remove = useCallback((id) => {
    setItems(prev => {
      const next = prev.filter(p => p.id !== id);
      if (next.length === 0) setCategoryId(null);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setCategoryId(null);
  }, []);

  return (
    <CompareContext.Provider value={{ items, add, remove, clear, categoryId, max: MAX_ITEMS }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);

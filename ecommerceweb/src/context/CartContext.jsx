import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); 
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const itemsArray = Array.isArray(cartItems) ? cartItems : [];
    if (!Array.isArray(cartItems)) {
      console.warn('[CartContext] cartItems not an array, received:', cartItems);
    }
    const count = itemsArray.reduce((sum, item) => sum + (item?.quantity || 0), 0);
    const total = itemsArray.reduce((sum, item) => {
      const lineTotal = item?.total_price != null
        ? item.total_price
        : (item?.price || 0) * (item?.quantity || 0);
      return sum + lineTotal;
    }, 0);
    setCartCount(count);
    setCartTotal(total);
  }, [cartItems]);

  const loadCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      let data = response.data;
      if (!Array.isArray(data)) {
        if (Array.isArray(data?.items)) data = data.items;
        else if (Array.isArray(data?.results)) data = data.results;
        else if (data == null) data = [];
      }
      if (!Array.isArray(data)) {
        console.warn('[CartContext.loadCart] Unable to normalize cart payload, setting empty array. Raw:', response.data);
        data = [];
      }
  const normalized = data.map(item => normalizeItem(item));
  setCartItems(normalized);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to cart');
    }

    try {
      setLoading(true);
      const response = await cartAPI.addToCart(productId, quantity);
      const currentItems = Array.isArray(cartItems) ? cartItems : [];
      const existingItemIndex = currentItems.findIndex(
        item => item.product === productId
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...currentItems];
        const merged = mergeItem(updatedItems[existingItemIndex], response.data);
        updatedItems[existingItemIndex] = normalizeItem(merged);
        setCartItems(updatedItems);
      } else {
        setCartItems(prev => [...prev, normalizeItem(response.data)]);
      }
      loadCart();
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to add item to cart';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return { success: true };
      }
      
      const response = await cartAPI.updateItem(itemId, quantity);
      
      setCartItems(prev => prev.map(item => {
        if (item.id !== itemId) return item;
        const merged = mergeItem(item, response.data);
        return normalizeItem(merged);
      }));
      loadCart();
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update cart item';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      await cartAPI.removeItem(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to remove item from cart';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
    setCartTotal(0);
  };

  const isItemInCart = (productId) => {
    const arr = Array.isArray(cartItems) ? cartItems : [];
    return arr.some(item => item.product === productId);
  };

  const getItemQuantity = (productId) => {
    const arr = Array.isArray(cartItems) ? cartItems : [];
    const item = arr.find(item => item.product === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    isItemInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

const PLACEHOLDER_IMG = '/placeholder-image.jpg';

function normalizeItem(item) {
  if (!item) return item;
  const copy = { ...item };
  if (copy.product_image) {
    if (typeof copy.product_image === 'string' && copy.product_image.startsWith('/')) {
      copy.product_image = `${window.location.origin}${copy.product_image}`;
    }
  } else {
    copy.product_image = PLACEHOLDER_IMG;
  }
  return copy;
}

function mergeItem(oldItem, newPartial) {
  if (!newPartial.product_image && oldItem.product_image) {
    return { ...oldItem, ...newPartial, product_image: oldItem.product_image };
  }
  return { ...oldItem, ...newPartial };
}

export default CartContext;

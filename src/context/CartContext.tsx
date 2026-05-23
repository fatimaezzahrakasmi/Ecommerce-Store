"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Order } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const cachedCart = localStorage.getItem('badr_cart_v1');
    if (cachedCart) {
      try {
        setCartItems(JSON.parse(cachedCart));
      } catch (err) {
        // Failed to parse cart cache - use empty cart
      }
    }
  }, []);

  const saveCartToCache = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('badr_cart_v1', JSON.stringify(items));
  };

  const addToCart = (product: Product, size: string, color: string, quantity: number = 1) => {
    const itemKey = `${product.id}_${size}_${color}`;
    const existingIndex = cartItems.findIndex((item) => item.id === itemKey);

    const updated = [...cartItems];
    if (existingIndex !== -1) {
      updated[existingIndex].quantity = Math.min(product.stock, updated[existingIndex].quantity + quantity);
    } else {
      updated.push({
        id: itemKey,
        product,
        quantity,
        selectedSize: size,
        selectedColor: color,
      });
    }
    saveCartToCache(updated);
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    const updated = cartItems
      .map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item))
      .filter((item) => item.quantity > 0);
    saveCartToCache(updated);
  };

  const removeItem = (cartItemId: string) => {
    const updated = cartItems.filter((item) => item.id !== cartItemId);
    saveCartToCache(updated);
  };

  const clearCart = () => {
    saveCartToCache([]);
  };

  const cartCount = cartItems.reduce((acc, current) => acc + current.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

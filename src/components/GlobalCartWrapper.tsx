"use client";
import React from 'react';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import { useRouter } from 'next/navigation';

export default function GlobalCartWrapper() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeItem } = useCart();
  const router = useRouter();

  return (
    <Cart
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      cartItems={cartItems}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
      onProceedToCheckout={() => {
        setIsCartOpen(false);
        router.push('/checkout');
      }}
    />
  );
}

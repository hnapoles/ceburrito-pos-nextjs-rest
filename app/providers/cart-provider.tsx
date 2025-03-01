'use client';
// cartContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { OrderLineBase } from '@/app/models/orders-model';

type CartContextType = {
  cart: OrderLineBase[];
  addToCart: (product: OrderLineBase) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  totalAmount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<OrderLineBase[]>([]);

  const addToCart = (product: OrderLineBase) => {
    setCart((prevCart) => {
      const productExists = prevCart.find(
        (item) => item.productId === product.productId,
      );
      if (productExists) {
        return prevCart.map((item) =>
          item.productId === product.productId
            ? {
                ...item,
                quantity: item.quantity + product.quantity,
                amount: (item.quantity + product.quantity) * item.unitPrice,
              }
            : item,
        );
      }
      return [...prevCart, product];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId),
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity, amount: quantity * item.unitPrice }
          : item,
      ),
    );
  };

  const totalAmount = cart.reduce((total, item) => total + item.amount, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

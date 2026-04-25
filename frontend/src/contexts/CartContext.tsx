import React, { createContext, useContext, useEffect, useState } from "react";
import CartService from "../services/cartService";
import { useAuth } from "./AuthContext";

type CartItem = {
  quantity: number;
};

type CartData = {
  items: CartItem[];
  [key: string]: unknown;
} | null;

type CartContextValue = {
  cartItemsCount: number;
  cart: CartData;
  loading: boolean;
  updateCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cart, setCart] = useState<CartData>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (isAuthenticated) {
      try {
        const response = (await CartService.getCart()) as CartData;
        setCart(response);
        setCartItemsCount(response?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setCart(null);
        setCartItemsCount(0);
      }
    } else {
      setCart(null);
      setCartItemsCount(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const updateCart = async () => {
    await fetchCart();
  };

  return <CartContext.Provider value={{ cartItemsCount, cart, loading, updateCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import CartService from "@/services/cartService";
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
  /** 登入狀態或購物車異動後，向後端重新拉取購物車 */
  updateCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

/** 與登入狀態無關的純 API 讀取，供初次載入與 `updateCart` 共用 */
async function pullCart(isAuthenticated: boolean): Promise<{ data: CartData; count: number }> {
  if (!isAuthenticated) {
    return { data: null, count: 0 };
  }
  try {
    const response = (await CartService.getCart()) as CartData;
    return {
      data: response,
      count: response?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    };
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    return { data: null, count: 0 };
  }
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cart, setCart] = useState<CartData>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { data, count } = await pullCart(isAuthenticated);
      if (!cancelled) {
        setCart(data);
        setCartItemsCount(count);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const updateCart = useCallback(async () => {
    const { data, count } = await pullCart(isAuthenticated);
    setCart(data);
    setCartItemsCount(count);
    setLoading(false);
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      cartItemsCount,
      cart,
      loading,
      updateCart,
    }),
    [cart, cartItemsCount, loading, updateCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

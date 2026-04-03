import React, { createContext, useState, useEffect, useContext } from 'react';
import CartService from '../services/cartService';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [cart, setCart] = useState(null); // 可以儲存完整的購物車資訊
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        if (isAuthenticated) {
            try {
                const response = await CartService.getCart();
                setCart(response);
                setCartItemsCount(response.items.reduce((sum, item) => sum + item.quantity, 0));
            } catch (error) {
                console.error('Failed to fetch cart:', error);
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
    }, [isAuthenticated]); // 當登入狀態改變時重新獲取購物車

    const updateCart = async () => {
        await fetchCart(); // 重新獲取購物車以更新狀態
    };

    return (
        <CartContext.Provider value={{ cartItemsCount, cart, loading, updateCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
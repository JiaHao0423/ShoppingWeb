import React, { useState, useEffect } from 'react';
import './CartPage.scss';
import { useNavigate } from "react-router-dom";
import Header from '../../components/layout/Header/Header.jsx';
import CartItem from "./CartItem.jsx";
import CartSummary from "./CartSummary.jsx";
import CartService from '../../services/cartService';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';

const Cart = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 獲取購物車資料
    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await CartService.getCart();
            console.log('後端回傳的購物車原始資料:', data);

            // 根據 Console 截圖，資料結構為 { id: 5, items: [...], totalAmount: 299 }
            const rawItems = data.items || [];

            const formattedItems = rawItems.map(({ id, quantity = 1, productVariant = {} }) => {
                //預防出現沒有讀取到商品資料
                const {
                    id: variantId,
                    productName: name = '未命名商品',
                    color = '無',
                    size = '無',
                    price = 0,
                    imageUrl
                } = productVariant;

                return {
                    id,
                    variantId,
                    name,
                    color,
                    size,
                    price: +price || 0,
                    quantity: +quantity,
                    img: imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200'
                };
            });

            console.log('格式化後的購物車資料:', formattedItems);
            setCartItems(formattedItems);
        } catch (err) {
            console.error('獲取購物車失敗:', err);
            setError('無法載入購物車，請稍後再試。');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (isAuthenticated) {
                fetchCart();
            } else {
                navigate(ROUTES.LOGIN);
            }
        }
    }, [isAuthenticated, authLoading, navigate]);

    /**
     * 計算購物車統計信息
     */
    const calculateCartStats = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = 0;
        const total = subtotal - discount;

        return { subtotal, discount, total };
    };

    /**
     * 更新商品數量
     */
    const handleQuantityChange = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await CartService.updateCartItemQuantity(cartItemId, newQuantity);
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === cartItemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (err) {
            console.error('更新數量失敗:', err);
            alert('更新數量失敗');
        }
    };

    /**
     * 刪除購物車項目
     */
    const handleRemoveItem = async (cartItemId) => {
        if (!window.confirm('確定要將此商品從購物車移除嗎？')) return;

        try {
            await CartService.removeCartItem(cartItemId);
            setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
        } catch (err) {
            console.error('刪除項目失敗:', err);
            alert('刪除失敗');
        }
    };

    /**
     * 結帳處理
     */
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('購物車是空的喔！');
            return;
        }
        navigate('/checkout');
    };

    /**
     * 返回上一頁
     */
    const handleGoBack = () => {
        navigate(-1);
    };

    if (authLoading || loading) {
        return (
            <div className="cart">
                <Header variant="cart" />
                <div className="cart__loading" style={{ padding: '100px', textAlign: 'center' }}>載入中...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cart">
                <Header variant="cart" />
                <div className="cart__error" style={{ padding: '100px', textAlign: 'center', color: 'red' }}>{error}</div>
            </div>
        );
    }

    const stats = calculateCartStats();

    return (
        <div className="cart">
            {/* 頁面頭部 - 行動版 */}
            <header className="cart__header">
                <button className="cart__back-btn" onClick={handleGoBack} aria-label="返回">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <h1 className="cart__title">購物車</h1>
            </header>

            {/* 導航欄 */}
            <Header variant="cart" />

            <main className="cart__container">
                {/* 桌機版表頭 */}
                <div className="cart__table-header">
                    <span className="cart__table-label">商品</span>
                    <span className="cart__table-label">價錢</span>
                    <span className="cart__table-label">數量</span>
                    <span className="cart__table-label">總價</span>
                    <span className="cart__table-label"></span>
                </div>

                {/* 購物車列表 */}
                <div className="cart__list">
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemoveItem}
                            />
                        ))
                    ) : (
                        <div className="cart__empty" style={{ padding: '50px', textAlign: 'center', color: '#999' }}>
                            您的購物車目前沒有商品
                        </div>
                    )}
                </div>

                {/* 購物車摘要 - 桌機版 */}
                {cartItems.length > 0 && (
                    <CartSummary
                        subtotal={stats.subtotal}
                        discount={stats.discount}
                        total={stats.total}
                        onCheckout={handleCheckout}
                    />
                )}
            </main>

            {/* 底部欄 - 行動版 */}
            {cartItems.length > 0 && (
                <footer className="cart-footer-mobile">
                    <div className="cart-footer-mobile__info">
                        <div className="cart-footer-mobile__total-label">總計</div>
                        <span className="cart-footer-mobile__price">${stats.total}</span>
                        <button className="cart-footer-mobile__btn" onClick={handleCheckout}>
                            下一步
                        </button>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default Cart;
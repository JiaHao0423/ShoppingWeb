import React, {useState} from 'react';
import './CartPage.scss';
import {useNavigate} from "react-router-dom";
import Header from '../../components/layout/Header/Header.jsx';
import CartItem from "./CartItem.jsx";
import CartSummary from "./CartSummary.jsx";

const Cart = () => {
    const navigate = useNavigate();

    // 初始商品數據
    const initialCartItems = [
        {
            id: 1,
            name: '女士短版襯衫',
            color: '#FFB6C1',
            size: 'S',
            price: 590,
            quantity: 1,
            img: 'https://media.istockphoto.com/id/1360648166/photo/classic-business-style-of-clothing.webp?a=1&b=1&s=612x612&w=0&k=20&c=QZrzfDc1WmpfW7gVgPAvNXnmFmylvhtmrHito_6ogFE='
        },
        {
            id: 2,
            name: '高腰牛仔褲',
            color: '#4A5568',
            size: 'M',
            price: 890,
            quantity: 1,
            img: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEhpZ2gtd2Fpc3RlZCUyMGplYW5zfGVufDB8fDB8fHww'
        },
        {
            id: 3,
            name: '簡約白色T恤',
            color: '#FFFFFF',
            size: 'L',
            price: 350,
            quantity: 2,
            img: 'https://plus.unsplash.com/premium_photo-1691367279139-218a8b8dcbb3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8U2ltcGxlJTIwd2hpdGUlMjBULXNoaXJ0fGVufDB8fDB8fHww'
        },
        {
            id: 4,
            name: '運動連帽外套',
            color: '#2C3E50',
            size: 'M',
            price: 1290,
            quantity: 1,
            img: 'https://images.unsplash.com/photo-1674316941849-69c9f21604e7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF0aGxldGljJTIwaG9vZGVkJTIwamFja2V0fGVufDB8fDB8fHww'
        },
        {
            id: 5,
            name: '碎花連身裙',
            color: '#FFE4E1',
            size: 'S',
            price: 1190,
            quantity: 1,
            img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmxvcmFsJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D'
        },
        {
            id: 6,
            name: '黑色皮革夾克',
            color: '#1A1A1A',
            size: 'M',
            price: 2490,
            quantity: 1,
            img: 'https://media.istockphoto.com/id/1305989617/photo/portrait-of-cool-young-handsome-man-wearing-leather-jacket-and-leaning-against-concrete-wall.webp?a=1&b=1&s=612x612&w=0&k=20&c=mEptiAgYJR9pLEVCvqLs1iadQMhRtHMGZnXZ9JQZNNI='
        },
    ];

    const [cartItems, setCartItems] = useState(initialCartItems);

    /**
     * 計算購物車統計信息
     */
    const calculateCartStats = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discount = Math.floor(subtotal * 0.1); // 模擬 10% 折扣
        const total = subtotal - discount;

        return { subtotal, discount, total };
    };

    /**
     * 更新商品數量
     */
    const handleQuantityChange = (itemId, newQuantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    /**
     * 刪除購物車項目
     */
    const handleRemoveItem = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    /**
     * 結帳處理
     */
    const handleCheckout = () => {
        // 預留空間：實際結帳功能將在此實現
        console.log('前往結帳頁面');
        navigate('/checkout');
    };

    /**
     * 返回上一頁
     */
    const handleGoBack = () => {
        navigate(-1);
    };

    const stats = calculateCartStats();
    const selectedItemsCount = cartItems.length;

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
                <div className="cart__header-icons">
                    <button className="cart__icon cart__icon--help" aria-label="幫助">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                            <path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-.8.6-1.3 1-1.3 2.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="17" r="1" fill="currentColor" />
                        </svg>
                    </button>
                    <button className="cart__icon cart__icon--user" aria-label="用戶">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
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
                        <div style={{ padding: '30px', textAlign: 'center', color: '#999' }}>
                            購物車為空
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
                    <label className="cart-footer-mobile__select-all">
                        <input type="checkbox" id="select-all" className="cart-footer-mobile__checkbox" />
                        <label htmlFor="select-all" className="cart-footer-mobile__checkbox-label"></label>
                        全部
                    </label>
                    <div className="cart-footer-mobile__info">
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

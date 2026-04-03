import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header/Header.jsx';
import Footer from '../../components/layout/Footer/Footer.jsx';
import './CheckoutPage.scss';
import {CameraIcon} from '../../components/Icons/Icons.jsx';
import { ROUTES } from '../../constants/routes.js';

/**
 * Checkout 頁面元件
 * 包含付款方式、運送方式、訂單資訊
 */
const CheckoutPage = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('credit');
    const [shippingMethod, setShippingMethod] = useState('home');

    // 模擬訂單商品資料
    const orderItems = [
        {
            id: 1,
            name: '女士短版襯衫',
            price: 590,
            quantity: 1,
            img: 'https://media.istockphoto.com/id/1360648166/photo/classic-business-style-of-clothing.webp?a=1&b=1&s=612x612&w=0&k=20&c=QZrzfDc1WmpfW7gVgPAvNXnmFmylvhtmrHito_6ogFE=',
        },
        {
            id: 2,
            name: '高腰牛仔褲',
            price: 590,
            quantity: 1,
            img: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&auto=format&fit=crop&q=60',
        },
        {
            id: 3,
            name: '簡約白色T恤',
            price: 590,
            quantity: 1,
            img: 'https://plus.unsplash.com/premium_photo-1691367279139-218a8b8dcbb3?w=600&auto=format&fit=crop&q=60',
        },
    ];

    const subtotal = 590;
    const shipping = 590;
    const discount = 590;
    const total = 590;

    /**
     * 返回上一頁
     */
    const handleGoBack = () => {
        navigate(-1);
    };

    /**
     * 刪除訂單項目
     */
    const handleRemoveItem = (itemId) => {
        console.log('刪除商品:', itemId);
    };

    /**
     * 結帳處理
     */
    const handleCheckout = () => {
        navigate(ROUTES.ORDER_COMPLETE);
    };

    return (
        <div className="checkout">
            {/* 行動版頂部 Header */}
            <header className="checkout__header">
                <button
                    className="checkout__back-btn"
                    onClick={handleGoBack}
                    aria-label="返回"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <h1 className="checkout__title">付款與運送</h1>
                <div className="checkout__header-icons">
                    <button className="checkout__icon" aria-label="幫助">
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                            <path
                                d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-.8.6-1.3 1-1.3 2.3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <circle cx="12" cy="17" r="1" fill="currentColor" />
                        </svg>
                    </button>
                    <button className="checkout__icon" aria-label="用戶">
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                            <path
                                d="M4 20c0-4 4-6 8-6s8 2 8 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>
            </header>

            {/* 桌面版 Header */}
            <Header variant="checkout" />

            <main className="checkout__container">
                {/* 左欄：付款方式 + 運送方式 */}
                <div className="checkout__form-area">
                    {/* ===== 付款方式 ===== */}
                    <section className="checkout-group">
                        <h2 className="checkout-group__title">付款方式</h2>

                        <div className="checkout-group__options">
                            {/* 貨到付款 */}
                            <label className="checkout-option">
                                <span className="checkout-option__radio-wrapper">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        className="checkout-option__input"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                    />
                                    <span className="checkout-option__radio" />
                                </span>
                                <span className="checkout-option__text">
                                    <span className="checkout-option__label">貨到付款</span>
                                    <span className="checkout-option__sublabel">滿999免運</span>
                                </span>
                            </label>

                            {/* 轉帳付款 */}
                            <label className="checkout-option">
                                <span className="checkout-option__radio-wrapper">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="transfer"
                                        className="checkout-option__input"
                                        checked={paymentMethod === 'transfer'}
                                        onChange={() => setPaymentMethod('transfer')}
                                    />
                                    <span className="checkout-option__radio" />
                                </span>
                                <span className="checkout-option__text">
                                    <span className="checkout-option__label">轉帳付款</span>
                                </span>
                            </label>

                            {/* 信用卡付款 */}
                            <label className="checkout-option checkout-option--active">
                                <span className="checkout-option__radio-wrapper">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="credit"
                                        className="checkout-option__input"
                                        checked={paymentMethod === 'credit'}
                                        onChange={() => setPaymentMethod('credit')}
                                    />
                                    <span className="checkout-option__radio" />
                                </span>
                                <span className="checkout-option__text">
                                    <span className="checkout-option__label">信用卡付款</span>
                                </span>
                            </label>
                        </div>

                        {/* 信用卡表單 */}
                        {paymentMethod === 'credit' && (
                            <div className="checkout-form">
                                <div className="checkout-form__section">
                                    <span className="checkout-form__section-label">卡片詳情</span>
                                    <div className="checkout-form__field checkout-form__field--icon">
                                        <input
                                            type="text"
                                            className="checkout-form__input"
                                            placeholder="卡片詳情"
                                        />
                                        <span className="checkout-form__input-icon">
                                            <CameraIcon className="checkout-form__input-svg"/>
                                        </span>
                                    </div>
                                    <div className="checkout-form__row">
                                        <div className="checkout-form__field">
                                            <input
                                                type="text"
                                                className="checkout-form__input"
                                                placeholder="到期日(MM/YY)"
                                            />
                                        </div>
                                        <div className="checkout-form__field">
                                            <input
                                                type="text"
                                                className="checkout-form__input"
                                                placeholder="安全驗證碼"
                                            />
                                        </div>
                                    </div>
                                    <div className="checkout-form__field">
                                        <input
                                            type="text"
                                            className="checkout-form__input"
                                            placeholder="持卡人名字"
                                        />
                                    </div>
                                </div>

                                <div className="checkout-form__section">
                                    <span className="checkout-form__section-label">帳單地址</span>
                                    <div className="checkout-form__field">
                                        <input
                                            type="text"
                                            className="checkout-form__input"
                                            placeholder="地址"
                                        />
                                    </div>
                                    <div className="checkout-form__field">
                                        <input
                                            type="text"
                                            className="checkout-form__input"
                                            placeholder="郵遞區號"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <hr className="checkout-group__divider" />
                    </section>

                    {/* ===== 運送方式 ===== */}
                    <section className="checkout-group">
                        <h2 className="checkout-group__title">運送方式</h2>

                        <div className="checkout-group__options">
                            {/* 7-11取貨 */}
                            <label className="checkout-option">
                                <span className="checkout-option__radio-wrapper">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        value="711"
                                        className="checkout-option__input"
                                        checked={shippingMethod === '711'}
                                        onChange={() => setShippingMethod('711')}
                                    />
                                    <span className="checkout-option__radio" />
                                </span>
                                <span className="checkout-option__text">
                                    <span className="checkout-option__label">7-11取貨</span>
                                    <span className="checkout-option__sublabel">滿999免運</span>
                                </span>
                            </label>

                            {/* 全家取貨 */}
                            <label className="checkout-option">
                                <span className="checkout-option__radio-wrapper">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        value="family"
                                        className="checkout-option__input"
                                        checked={shippingMethod === 'family'}
                                        onChange={() => setShippingMethod('family')}
                                    />
                                    <span className="checkout-option__radio" />
                                </span>
                                <span className="checkout-option__text">
                                    <span className="checkout-option__label">全家取貨</span>
                                    <span className="checkout-option__sublabel">滿999免運</span>
                                </span>
                            </label>

                            {/* 宅配到府 */}
                            <label className="checkout-option checkout-option--active">
                                <span className="checkout-option__radio-wrapper">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        value="home"
                                        className="checkout-option__input"
                                        checked={shippingMethod === 'home'}
                                        onChange={() => setShippingMethod('home')}
                                    />
                                    <span className="checkout-option__radio" />
                                </span>
                                <span className="checkout-option__text">
                                    <span className="checkout-option__label">宅配到府</span>
                                </span>
                            </label>
                        </div>

                        {/* 宅配表單 */}
                        {shippingMethod === 'home' && (
                            <div className="checkout-form">
                                <div className="checkout-form__row checkout-form__row--shipping">
                                    <div className="checkout-form__field">
                                        <span className="checkout-form__section-label">收件人姓名</span>
                                        <input
                                            type="text"
                                            className="checkout-form__input"
                                            placeholder="請輸入真實姓名"
                                        />
                                    </div>
                                    <div className="checkout-form__field">
                                        <span className="checkout-form__section-label">手機號碼</span>
                                        <div className="checkout-form__phone-row">
                                            <select className="checkout-form__select">
                                                <option value="+886">+886</option>
                                            </select>
                                            <input
                                                type="tel"
                                                className="checkout-form__input"
                                                placeholder="912345678"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="checkout-form__field">
                                    <span className="checkout-form__section-label">地址</span>
                                    <input
                                        type="text"
                                        className="checkout-form__input"
                                        placeholder="請輸入真實地址"
                                    />
                                </div>
                            </div>
                        )}

                        <hr className="checkout-group__divider" />
                    </section>
                </div>

                {/* 右欄：訂單資訊 / 小計 */}
                <aside className="checkout-summary">
                    <h2 className="checkout-summary__title checkout-summary__title--mobile">
                        訂單資訊
                    </h2>
                    <h2 className="checkout-summary__title checkout-summary__title--desktop">
                        小計
                    </h2>

                    {/* 商品列表 */}
                    <div className="checkout-summary__product-list">
                        {orderItems.map((item) => (
                            <div className="checkout-product" key={item.id}>
                                <img
                                    className="checkout-product__img"
                                    src={item.img}
                                    alt={item.name}
                                />
                                <div className="checkout-product__info">
                                    <span className="checkout-product__price">
                                        ${item.price} ({item.quantity})
                                    </span>
                                    <button
                                        className="checkout-product__delete-btn"
                                        onClick={() => handleRemoveItem(item.id)}
                                        aria-label="刪除商品"
                                    >
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                            <path d="M10 11v6" />
                                            <path d="M14 11v6" />
                                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 金額摘要 */}
                    <div className="checkout-summary__details">
                        <div className="checkout-summary__row">
                            <span>小計</span>
                            <span>${subtotal}</span>
                        </div>
                        <div className="checkout-summary__row">
                            <span>運費</span>
                            <span>${shipping}</span>
                        </div>
                        <div className="checkout-summary__row">
                            <span>折扣</span>
                            <span>${discount}</span>
                        </div>
                    </div>

                    {/* 桌面版總結 + 下一步按鈕 */}
                    <div className="checkout-summary__total-section">
                        <hr className="checkout-summary__divider" />
                        <div className="checkout-summary__row checkout-summary__row--total">
                            <span>總結</span>
                            <span className="checkout-summary__total-price">${total}</span>
                        </div>
                        <button
                            className="checkout-summary__next-btn"
                            onClick={handleCheckout}
                        >
                            下一步
                        </button>
                    </div>
                </aside>
            </main>

            {/* 行動版底部固定欄 */}
            <footer className="checkout-footer">
                <span className="checkout-footer__label">總結</span>
                <div className="checkout-footer__right">
                    <span className="checkout-footer__price">${total}</span>
                    <button className="checkout-footer__btn" onClick={handleCheckout}>
                        結帳
                    </button>
                </div>
            </footer>

            {/* 桌面版 Footer */}
            <div className="checkout__desktop-footer">
                <Footer />
            </div>
        </div>
    );
};

export default CheckoutPage;
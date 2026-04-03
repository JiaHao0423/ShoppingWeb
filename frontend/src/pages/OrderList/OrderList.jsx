import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header/Header.jsx';
import Footer from '../../components/layout/Footer/Footer.jsx';
import './OrderList.scss';

// ==================== 常量 ====================

const ORDER_TABS = [
    { id: 'all',       label: '全部訂單' },
    { id: 'pending',   label: '待付款' },
    { id: 'shipping',  label: '待出貨' },
    { id: 'receiving', label: '待收貨' },
    { id: 'return',    label: '退貨/退款' },
    { id: 'cancel',    label: '取消' },
];

const ORDERS = [
    {
        id: '12345678',
        status: '待收貨',
        statusKey: 'receiving',
        items: [
            { img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&auto=format&fit=crop&q=60', price: 590, qty: 1 },
            { img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&auto=format&fit=crop&q=60', price: 590, qty: 1 },
            { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&auto=format&fit=crop&q=60', price: 590, qty: 1 },
            { img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&auto=format&fit=crop&q=60', price: 590, qty: 1 },
        ],
        total: 590,
        actions: [
            { label: '評價', variant: 'outline' },
            { label: '申請退貨', variant: 'outline' },
            { label: '確認收貨', variant: 'solid' },
        ],
    },
    {
        id: '12345678',
        status: '待付款',
        statusKey: 'pending',
        items: [
            { img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&auto=format&fit=crop&q=60', price: 590, qty: 1 },
            { img: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=200&auto=format&fit=crop&q=60', price: 590, qty: 1 },
        ],
        total: 590,
        actions: [
            { label: '修改資料', variant: 'outline' },
            { label: '取消訂單', variant: 'solid' },
        ],
    },
    {
        id: '12345678',
        status: '已完成',
        statusKey: 'completed',
        items: [
            { img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&auto=format&fit=crop&q=60', price: 590, qty: 1 },
        ],
        total: 590,
        actions: [
            { label: '查看評價', variant: 'outline' },
            { label: '再買一次', variant: 'solid' },
        ],
    },
    {
        id: '12345678',
        status: '待收貨',
        statusKey: 'receiving',
        items: [
            { img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&auto=format&fit=crop&q=60', price: 590, qty: 1 },
            { img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&auto=format&fit=crop&q=60', price: 590, qty: 1 },
            { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&auto=format&fit=crop&q=60', price: 590, qty: 1 },
            { img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&auto=format&fit=crop&q=60', price: 590, qty: 1 },
        ],
        total: 590,
        actions: [
            { label: '評價', variant: 'outline' },
            { label: '申請退貨', variant: 'outline' },
            { label: '確認收貨', variant: 'solid' },
        ],
    },
];

// ==================== 主組件 ====================

const OrderListPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');

    const handleGoBack = () => navigate(-1);

    const filteredOrders = activeTab === 'all'
        ? ORDERS
        : ORDERS.filter((o) => o.statusKey === activeTab);

    return (
        <div className="order-list">

            {/* ── 行動版 Header ── */}
            <header className="order-list__mobile-header">
                <button className="order-list__mobile-header-btn" onClick={handleGoBack} aria-label="返回">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <h1 className="order-list__mobile-header-title">訂單</h1>
                <div className="order-list__mobile-header-icons">
                    <button className="order-list__mobile-header-icon-btn" aria-label="搜尋">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>
                    <button className="order-list__mobile-header-icon-btn" aria-label="幫助">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* ── 行動版 Tab 列（水平捲動） ── */}
            <nav className="order-list__mobile-tabs">
                {ORDER_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`order-list__mobile-tab${activeTab === tab.id ? ' order-list__mobile-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* ── 桌面版 Header ── */}
            <Header variant="order-list" />

            {/* ── 主內容 ── */}
            <main className="order-list__main">
                <div className="container">
                    <div className="order-list__body">

                        {/* ── 桌面版側欄 ── */}
                        <aside className="order-list__sidebar">
                            <h2 className="order-list__sidebar-title">我的訂單</h2>
                            <ul className="order-list__sidebar-nav">
                                {ORDER_TABS.map((tab) => (
                                    <li key={tab.id} className="order-list__sidebar-nav-item">
                                        <button
                                            className={`order-list__sidebar-nav-btn${activeTab === tab.id ? ' order-list__sidebar-nav-btn--active' : ''}`}
                                            onClick={() => setActiveTab(tab.id)}
                                        >
                                            {tab.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </aside>

                        {/* ── 訂單列表 ── */}
                        <section className="order-list__content">

                            {/* 桌面版表頭 */}
                            <div className="order-list__table-head">
                                <span className="order-list__th">訂單編號</span>
                                <span className="order-list__th">商品</span>
                                <span className="order-list__th">總價</span>
                                <span className="order-list__th">狀態</span>
                            </div>

                            {/* 訂單卡片 */}
                            {filteredOrders.map((order, idx) => (
                                <article key={idx} className="order-list__order">

                                    {/* 行動版：訂單標題列 */}
                                    <div className="order-list__order-header">
                                        <span className="order-list__order-header-id">訂單編號：{order.id}</span>
                                        <span className={`order-list__order-header-status order-list__order-header-status--${order.statusKey}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    {/* 行動版：商品圖片橫向捲動 */}
                                    <div className="order-list__order-items-mobile">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="order-list__order-item-card">
                                                <img className="order-list__order-item-img" src={item.img} alt={`商品 ${i + 1}`} />
                                                <span className="order-list__order-item-price">${item.price} ( {item.qty} )</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 桌面版：表格行 */}
                                    <div className="order-list__order-row">
                                        <span className="order-list__order-id">{order.id}</span>
                                        <div className="order-list__order-images">
                                            {order.items.map((item, i) => (
                                                <img key={i} className="order-list__order-thumb" src={item.img} alt={`商品 ${i + 1}`} />
                                            ))}
                                        </div>
                                        <span className="order-list__order-total">${order.total}</span>
                                        <span className={`order-list__order-status order-list__order-status--${order.statusKey}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    {/* 操作按鈕 */}
                                    <div className="order-list__order-actions">
                                        {order.actions.map((action, ai) => (
                                            <button
                                                key={ai}
                                                className={`order-list__action-btn order-list__action-btn--${action.variant}`}
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </section>
                    </div>
                </div>
            </main>

            {/* ── 桌面版 Footer ── */}
            <div className="order-list__footer-wrapper">
                <Footer />
            </div>
        </div>
    );
};

export default OrderListPage;
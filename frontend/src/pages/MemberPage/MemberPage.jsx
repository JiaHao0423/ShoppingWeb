import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header/Header.jsx';
import Footer from '../../components/layout/Footer/Footer.jsx';
import { ROUTES } from '../../constants/routes.js';
import { useAuth } from '../../contexts/AuthContext';
import './MemberPage.scss';

// ==================== 模擬資料 ====================

const MEMBER = {
    name: '王小明',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&auto=format&fit=crop&q=60',
};

const ORDER_STATUS_TABS = [
    {id: 'pending_payment', label: '待付款', icon: <CreditCardIcon/>},
    {id: 'pending_shipment', label: '待出貨', icon: <BoxIcon/>},
    {id: 'pending_receipt', label: '待收貨', icon: <DownloadBoxIcon/>, active: true},
    {id: 'completed', label: '已完成', icon: <CheckBadgeIcon/>},
];

const TOOLS = [
    {id: 'wishlist', label: '我的收藏', icon: <HeartIcon/>},
    {id: 'history', label: '歷史紀錄', icon: <BookOpenIcon/>, active: true},
    {id: 'coupon', label: '優惠券', icon: <TicketIcon/>},
    {id: 'payment', label: '付款方式', icon: <WalletIcon/>},
    {id: 'rating', label: '評價', icon: <StarIcon/>},
    {id: 'review', label: '我的評論', icon: <ChatIcon/>},
    {id: 'address', label: '收貨地址', icon: <LocationIcon/>},
];

const RECENT_ORDERS = [
    {
        id: '12345678',
        images: [
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=120&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=120&auto=format&fit=crop&q=60',
        ],
        total: 590,
        status: '待收貨',
        statusKey: 'pending_receipt',
        actions: [
            {label: '評價', variant: 'outline'},
            {label: '申請退貨', variant: 'outline'},
            {label: '確認收貨', variant: 'solid'},
        ],
    },
    {
        id: '12345678',
        images: [
            'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=120&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=120&auto=format&fit=crop&q=60',
        ],
        total: 590,
        status: '待付款',
        statusKey: 'pending_payment',
        actions: [
            {label: '修改資料', variant: 'outline'},
            {label: '取消訂單', variant: 'solid'},
        ],
    },
    {
        id: '12345678',
        images: [
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&auto=format&fit=crop&q=60',
        ],
        total: 590,
        status: '已完成',
        statusKey: 'completed',
        actions: [
            {label: '查看評價', variant: 'outline'},
            {label: '再買一次', variant: 'solid'},
        ],
    },
];

// ==================== SVG 圖標組件 ====================

function CreditCardIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
             strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
    );
}

function BoxIcon() {
    return (
        <svg
            viewBox="0 0 29 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path
                d="M10 7C10 9.48528 12.0147 11.5 14.5 11.5C16.9853 11.5 19 9.48528 19 7M1 20.2003V5.80029C1 4.12014 1 3.27943 1.32698 2.6377C1.6146 2.07321 2.07321 1.6146 2.6377 1.32698C3.27943 1 4.12014 1 5.80029 1H23.2003C24.8805 1 25.7194 1 26.3611 1.32698C26.9256 1.6146 27.3857 2.07321 27.6733 2.6377C28 3.2788 28 4.11849 28 5.79537V20.2054C28 21.8822 28 22.7207 27.6733 23.3618C27.3857 23.9263 26.9256 24.3857 26.3611 24.6733C25.72 25 24.8815 25 23.2046 25H5.79537C4.11849 25 3.2788 25 2.6377 24.6733C2.07321 24.3857 1.6146 23.9263 1.32698 23.3618C1 22.7201 1 21.8805 1 20.2003Z"
            />
        </svg>
    );
}

function DownloadBoxIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
             strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
    );
}

function CheckBadgeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
             strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <polyline points="9 12 11 14 15 10"/>
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
             strokeLinejoin="round">
            <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
    );
}

function BookOpenIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
             strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
    );
}

function TicketIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
             strokeLinejoin="round">
            <path
                d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
        </svg>
    );
}

function WalletIcon() {
    return (
        <svg
            viewBox="0 0 29 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path
                d="M26.5 7H23.2729C22.5267 7 22 6.24626 22 5.5C22 3.01472 19.9853 1 17.5 1C15.0147 1 13 3.01472 13 5.5C13 6.24626 12.4733 7 11.727 7H8.5C7.67157 7 7 7.67157 7 8.5V11.727C7 12.4733 6.24626 13 5.5 13C3.01472 13 1 15.0147 1 17.5C1 19.9853 3.01472 22 5.5 22C6.24626 22 7 22.5267 7 23.2729V26.5C7 27.3284 7.67157 28 8.5 28L26.5 28C27.3284 28 28 27.3284 28 26.5V23.2729C28 22.5267 27.2463 22 26.5 22C24.0147 22 22 19.9853 22 17.5C22 15.0147 24.0147 13 26.5 13C27.2463 13 28 12.4733 28 11.727L28 8.5C28 7.67157 27.3284 7 26.5 7Z"
            />
        </svg>
    );
}

function StarIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
             strokeLinejoin="round">
            <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
    );
}

function ChatIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
             strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
    );
}

function LocationIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
             strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
    );
}

function BellIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
             strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
    );
}

function SettingsIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
             strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
             strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
        </svg>
    );
}

// ==================== 主頁面組件 ====================

const MemberPage = () => {
    const navigate = useNavigate();
    const [activeOrderTab, setActiveOrderTab] = useState('');
    const [activeTool, setActiveTool] = useState('');
    const { logout } = useAuth();

    const handleGoBack = () => navigate(-1);
    const handleAllOrders = () => navigate(ROUTES.ORDERS);

    const handleLogout = () => {
        logout();  // 清除認證狀態和 localStorage
        navigate(ROUTES.LOGIN);  // 導向登入頁面
    };

    return (
        <div className="member-page">

            {/* ── 行動版 Header ── */}
            <header className="member-page__mobile-header">
                <button
                    className="member-page__mobile-header-btn"
                    onClick={handleGoBack}
                    aria-label="返回"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                </button>
                <h1 className="member-page__mobile-header-title">會員</h1>
                <div className="member-page__mobile-header-icons">
                    <button className="member-page__mobile-header-icon-btn" aria-label="通知">
                        <BellIcon/>
                    </button>
                    <button className="member-page__mobile-header-icon-btn" aria-label="設定">
                        <SettingsIcon/>
                    </button>
                    <button className="member-page__mobile-header-icon-btn" aria-label="登出" onClick={handleLogout}>
                        <LogoutIcon/>
                    </button>
                </div>
            </header>

            {/* ── 桌面版 Header ── */}
            <Header variant="member"/>

            {/* ── 主內容 ── */}
            <main className="member-page__main">
                <div className="container">

                    {/* ── 用戶資訊列（桌面版橫排 / 行動版直排） ── */}
                    <section className="member-page__profile">
                        <div className="member-page__avatar-wrapper">
                            <img
                                className="member-page__avatar"
                                src={MEMBER.avatar}
                                alt={MEMBER.name}
                            />
                        </div>
                        <span className="member-page__name">{MEMBER.name}</span>
                        {/* 桌面版問號按鈕 */}
                        <button className="member-page__help-btn" aria-label="登出" onClick={handleLogout}>
                            <LogoutIcon/>
                        </button>
                    </section>

                    {/* ── 主體（桌面版左右分欄） ── */}
                    <div className="member-page__body">

                        {/* ── 左側側欄 ── */}
                        <aside className="member-page__sidebar">

                            {/* 我的訂單 */}
                            <div className="member-page__card">
                                <div className="member-page__card-header">
                                    <h2 className="member-page__card-title">我的訂單</h2>
                                    <button
                                        className="member-page__card-link"
                                        onClick={handleAllOrders}
                                    >
                                        全部訂單
                                        <span className="member-page__card-link-icon">
                                            <ChevronRightIcon/>
                                        </span>
                                    </button>
                                </div>

                                <ul className="member-page__order-tabs">
                                    {ORDER_STATUS_TABS.map((tab) => (
                                        <li key={tab.id} className="member-page__order-tab-item">
                                            {/* 行動版：圖標 + 文字直排 */}
                                            <button
                                                className={`member-page__order-tab-btn${activeOrderTab === tab.id ? ' member-page__order-tab-btn--active' : ''}`}
                                                onClick={() => setActiveOrderTab(tab.id)}
                                                aria-pressed={activeOrderTab === tab.id}
                                            >
                                                <span className="member-page__order-tab-icon">
                                                    {tab.icon}
                                                </span>
                                                <span className="member-page__order-tab-label">
                                                    {tab.label}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 常用工具 */}
                            <div className="member-page__card member-page__card--tools">
                                <h2 className="member-page__card-title">常用工具</h2>

                                {/* 行動版：Grid 排列 */}
                                <ul className="member-page__tools-grid">
                                    {TOOLS.map((tool) => (
                                        <li key={tool.id} className="member-page__tool-item">
                                            <button
                                                className={`member-page__tool-btn${activeTool === tool.id ? ' member-page__tool-btn--active' : ''}`}
                                                onClick={() => setActiveTool(tool.id)}
                                                aria-pressed={activeTool === tool.id}
                                            >
                                                <span className="member-page__tool-icon">
                                                    {tool.icon}
                                                </span>
                                                <span className="member-page__tool-label">
                                                    {tool.label}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {/* 桌面版：List 排列 */}
                                <ul className="member-page__tools-list">
                                    {TOOLS.map((tool) => (
                                        <li key={`list-${tool.id}`} className="member-page__tools-list-item">
                                            <button
                                                className={`member-page__tools-list-btn${activeTool === tool.id ? ' member-page__tools-list-btn--active' : ''}`}
                                                onClick={() => setActiveTool(tool.id)}
                                                aria-pressed={activeTool === tool.id}
                                            >
                                                <span className="member-page__tools-list-icon">
                                                    {tool.icon}
                                                </span>
                                                <span className="member-page__tools-list-label">
                                                    {tool.label}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* ── 右側內容（桌面版：最近訂單表格） ── */}
                        <section className="member-page__orders-panel">
                            <h2 className="member-page__orders-panel-title">最近訂單</h2>

                            <div className="member-page__orders-table">
                                {/* 表頭 */}
                                <div className="member-page__orders-thead">
                                    <span className="member-page__orders-th">訂單編號</span>
                                    <span className="member-page__orders-th">商品</span>
                                    <span className="member-page__orders-th">總價</span>
                                    <span className="member-page__orders-th">狀態</span>
                                </div>

                                {/* 訂單列 */}
                                {RECENT_ORDERS.map((order, idx) => (
                                    <div key={`${order.id}-${order.statusKey}-${idx}`} className="member-page__order-row">
                                        <div className="member-page__order-row-main">
                                            <span className="member-page__order-id">{order.id}</span>
                                            <div className="member-page__order-images">
                                                {order.images.map((img, i) => (
                                                    <img
                                                        key={`${order.id}-${img}-${i}`}
                                                        className="member-page__order-img"
                                                        src={img}
                                                        alt={`訂單商品 ${i + 1}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="member-page__order-total">${order.total}</span>
                                            <span
                                                className={`member-page__order-status member-page__order-status--${order.statusKey}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="member-page__order-actions">
                                            {order.actions.map((action, ai) => (
                                                <button
                                                    key={`${order.id}-${action.label}-${ai}`}
                                                    className={`member-page__order-action-btn member-page__order-action-btn--${action.variant}`}
                                                >
                                                    {action.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* ── 桌面版 Footer ── */}
            <div className="member-page__footer-wrapper">
                <Footer/>
            </div>
        </div>
    );
};

export default MemberPage;
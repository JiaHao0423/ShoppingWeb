import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../../components/layout/Header/Header.jsx';
import Footer from '../../components/layout/Footer/Footer.jsx';
import OrderService from '../../services/orderService';
import './OrderListPage.scss';

// ==================== 常量 ====================

const ORDER_TABS = [
    {id: 'all', label: '全部訂單'},
    {id: 'PENDING', label: '待付款'},
    {id: 'SHIPPED', label: '待出貨'},
    {id: 'DELIVERED', label: '待收貨'},
    {id: 'CANCELLED', label: '已取消'},
];

// ==================== 主組件 ====================

const OrderListPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. 獲取真實訂單資料
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await OrderService.getOrders();

                console.log(data);
                // console.log(data[0].items[0].productVariant.imageUrl);

                // 將後端資料轉換為您 UI 預期的格式
                const formattedOrders = data.map(order => ({
                    id: order.id.toString(),
                    status: getStatusLabel(order.status),
                    statusKey: order.status,
                    total: order.totalAmount,
                    items: order.items.map(item => ({
                        img: item.productVariant?.imageUrl || 'https://via.placeholder.com/200',
                        price: item.price,
                        qty: item.quantity
                    })),
                    // 根據狀態動態生成按鈕 (範例)
                    actions: getActionsByStatus(order.status)
                }));

                console.log(formattedOrders);

                setOrders(formattedOrders);
            } catch (err) {
                console.error('獲取訂單失敗:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusLabel = (status) => {
        const labels = {
            'PENDING': '待付款',
            'SHIPPED': '待出貨',
            'DELIVERED': '待收貨',
            'CANCELLED': '已取消',
            'COMPLETED': '已完成'
        };
        return labels[status] || status;
    };

    const getActionsByStatus = (status) => {
        if (status === 'PENDING') return [{label: '取消訂單', variant: 'solid'}];
        if (status === 'DELIVERED') return [{label: '確認收貨', variant: 'solid'}, {label: '評價', variant: 'outline'}];
        return [{label: '查看詳情', variant: 'outline'}];
    };

    const handleGoBack = () => navigate(-1);

    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter((o) => o.statusKey === activeTab);


    if (loading) return <div className="order-list__loading">載入中...</div>;

    return (
        <div className="order-list">

            {/* ── 行動版 Header ── */}
            <header className="order-list__mobile-header">
                <button className="order-list__mobile-header-btn" onClick={handleGoBack} aria-label="返回">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                </button>
                <h1 className="order-list__mobile-header-title">訂單</h1>
                <div className="order-list__mobile-header-icons">
                    <button className="order-list__mobile-header-icon-btn" aria-label="搜尋">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                    </button>
                </div>
            </header>

            {/* ── 行動版 Tab 列 ── */}
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
            <Header variant="order-list"/>

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

                            {filteredOrders.length === 0 ? (
                                <div className="order-list__empty">目前沒有相關訂單</div>
                            ) : (
                                filteredOrders.map((order, idx) => (
                                    <article key={idx} className="order-list__order">
                                        {/* 行動版：訂單標題列 */}
                                        <div className="order-list__order-header">
                                            <span className="order-list__order-header-id">訂單編號：{order.id}</span>
                                            <span
                                                className={`order-list__order-header-status order-list__order-header-status--${order.statusKey.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        {/* 行動版：商品圖片橫向捲動 */}
                                        <div className="order-list__order-items-mobile">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="order-list__order-item-card">
                                                    <img className="order-list__order-item-img" src={item.img}
                                                         alt="商品"/>
                                                    <span
                                                        className="order-list__order-item-price">${item.price} ( {item.qty} )</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* 桌面版：表格行 */}
                                        <div className="order-list__order-row">
                                            <span className="order-list__order-id">{order.id}</span>
                                            <div className="order-list__order-images">
                                                {order.items.map((item, i) => (
                                                    <img key={i} className="order-list__order-thumb" src={item.img}
                                                         alt="商品"/>
                                                ))}
                                            </div>
                                            <span className="order-list__order-total">${order.total}</span>
                                            <span
                                                className={`order-list__order-status order-list__order-status--${order.statusKey.toLowerCase()}`}>
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
                                ))
                            )}
                        </section>
                    </div>
                </div>
            </main>

            <div className="order-list__footer-wrapper">
                <Footer/>
            </div>
        </div>
    );
};

export default OrderListPage;

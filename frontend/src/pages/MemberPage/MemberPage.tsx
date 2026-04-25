import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import {
  BackIcon,
  BellIcon,
  BookOpenIcon,
  BoxIcon,
  ChatIcon,
  CheckBadgeIcon,
  ChevronRightIcon,
  CreditCardIcon,
  DownloadBoxIcon,
  HeartIcon,
  LocationIcon,
  LogoutIcon,
  SettingsIcon,
  StarIcon,
  TicketIcon,
  WalletIcon,
} from "../../components/Icons/Icons";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";
import "./MemberPage.scss";

const MEMBER = {
  name: "王小明",
  avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&auto=format&fit=crop&q=60",
};

const ORDER_STATUS_TABS = [
  { id: "pending_payment", label: "待付款", icon: <CreditCardIcon /> },
  { id: "pending_shipment", label: "待出貨", icon: <BoxIcon /> },
  { id: "pending_receipt", label: "待收貨", icon: <DownloadBoxIcon />, active: true },
  { id: "completed", label: "已完成", icon: <CheckBadgeIcon /> },
];

const TOOLS = [
  { id: "wishlist", label: "我的收藏", icon: <HeartIcon /> },
  { id: "history", label: "歷史紀錄", icon: <BookOpenIcon />, active: true },
  { id: "coupon", label: "優惠券", icon: <TicketIcon /> },
  { id: "payment", label: "付款方式", icon: <WalletIcon /> },
  { id: "rating", label: "評價", icon: <StarIcon /> },
  { id: "review", label: "我的評論", icon: <ChatIcon /> },
  { id: "address", label: "收貨地址", icon: <LocationIcon /> },
];

const RECENT_ORDERS = [
  {
    id: "12345678",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=120&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=120&auto=format&fit=crop&q=60",
    ],
    total: 590,
    status: "待收貨",
    statusKey: "pending_receipt",
    actions: [
      { label: "評價", variant: "outline" },
      { label: "申請退貨", variant: "outline" },
      { label: "確認收貨", variant: "solid" },
    ],
  },
  {
    id: "12345678",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=120&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=120&auto=format&fit=crop&q=60",
    ],
    total: 590,
    status: "待付款",
    statusKey: "pending_payment",
    actions: [
      { label: "修改資料", variant: "outline" },
      { label: "取消訂單", variant: "solid" },
    ],
  },
  {
    id: "12345678",
    images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&auto=format&fit=crop&q=60"],
    total: 590,
    status: "已完成",
    statusKey: "completed",
    actions: [
      { label: "查看評價", variant: "outline" },
      { label: "再買一次", variant: "solid" },
    ],
  },
];

const MemberPage = () => {
  const navigate = useNavigate();
  const [activeOrderTab, setActiveOrderTab] = useState("");
  const [activeTool, setActiveTool] = useState("");
  const { logout } = useAuth();

  const handleGoBack = () => navigate(-1);
  const handleAllOrders = () => navigate(ROUTES.ORDERS);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="member-page">
      <header className="member-page__mobile-header">
        <button className="member-page__mobile-header-btn" onClick={handleGoBack} aria-label="返回">
          <BackIcon />
        </button>
        <h1 className="member-page__mobile-header-title">會員</h1>
        <div className="member-page__mobile-header-icons">
          <button className="member-page__mobile-header-icon-btn" aria-label="通知">
            <BellIcon />
          </button>
          <button className="member-page__mobile-header-icon-btn" aria-label="設定">
            <SettingsIcon />
          </button>
          <button className="member-page__mobile-header-icon-btn" aria-label="登出" onClick={handleLogout}>
            <LogoutIcon />
          </button>
        </div>
      </header>

      <Header variant="member" />

      <main className="member-page__main">
        <div className="container">
          <section className="member-page__profile">
            <div className="member-page__avatar-wrapper">
              <img className="member-page__avatar" src={MEMBER.avatar} alt={MEMBER.name} />
            </div>
            <span className="member-page__name">{MEMBER.name}</span>
            <button className="member-page__help-btn" aria-label="登出" onClick={handleLogout}>
              <LogoutIcon />
            </button>
          </section>

          <div className="member-page__body">
            <aside className="member-page__sidebar">
              <div className="member-page__card">
                <div className="member-page__card-header">
                  <h2 className="member-page__card-title">我的訂單</h2>
                  <button className="member-page__card-link" onClick={handleAllOrders}>
                    全部訂單
                    <span className="member-page__card-link-icon">
                      <ChevronRightIcon />
                    </span>
                  </button>
                </div>

                <ul className="member-page__order-tabs">
                  {ORDER_STATUS_TABS.map((tab) => (
                    <li key={tab.id} className="member-page__order-tab-item">
                      <button
                        className={`member-page__order-tab-btn${activeOrderTab === tab.id ? " member-page__order-tab-btn--active" : ""}`}
                        onClick={() => setActiveOrderTab(tab.id)}
                        aria-pressed={activeOrderTab === tab.id}
                      >
                        <span className="member-page__order-tab-icon">{tab.icon}</span>
                        <span className="member-page__order-tab-label">{tab.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="member-page__card member-page__card--tools">
                <h2 className="member-page__card-title">常用工具</h2>

                <ul className="member-page__tools-grid">
                  {TOOLS.map((tool) => (
                    <li key={tool.id} className="member-page__tool-item">
                      <button
                        className={`member-page__tool-btn${activeTool === tool.id ? " member-page__tool-btn--active" : ""}`}
                        onClick={() => setActiveTool(tool.id)}
                        aria-pressed={activeTool === tool.id}
                      >
                        <span className="member-page__tool-icon">{tool.icon}</span>
                        <span className="member-page__tool-label">{tool.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                <ul className="member-page__tools-list">
                  {TOOLS.map((tool) => (
                    <li key={`list-${tool.id}`} className="member-page__tools-list-item">
                      <button
                        className={`member-page__tools-list-btn${activeTool === tool.id ? " member-page__tools-list-btn--active" : ""}`}
                        onClick={() => setActiveTool(tool.id)}
                        aria-pressed={activeTool === tool.id}
                      >
                        <span className="member-page__tools-list-icon">{tool.icon}</span>
                        <span className="member-page__tools-list-label">{tool.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <section className="member-page__orders-panel">
              <h2 className="member-page__orders-panel-title">最近訂單</h2>

              <div className="member-page__orders-table">
                <div className="member-page__orders-thead">
                  <span className="member-page__orders-th">訂單編號</span>
                  <span className="member-page__orders-th">商品</span>
                  <span className="member-page__orders-th">總價</span>
                  <span className="member-page__orders-th">狀態</span>
                </div>

                {RECENT_ORDERS.map((order, idx) => (
                  <div key={`${order.id}-${order.statusKey}-${idx}`} className="member-page__order-row">
                    <div className="member-page__order-row-main">
                      <span className="member-page__order-id">{order.id}</span>
                      <div className="member-page__order-images">
                        {order.images.map((img, i) => (
                          <img key={`${order.id}-${img}-${i}`} className="member-page__order-img" src={img} alt={`訂單商品 ${i + 1}`} />
                        ))}
                      </div>
                      <span className="member-page__order-total">${order.total}</span>
                      <span className={`member-page__order-status member-page__order-status--${order.statusKey}`}>{order.status}</span>
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

      <div className="member-page__footer-wrapper">
        <Footer />
      </div>
    </div>
  );
};

export default MemberPage;

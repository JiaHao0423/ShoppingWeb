import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import OrderService from "../../services/orderService";
import "./OrderListPage.scss";

const ORDER_TABS = [
  { id: "all", label: "全部訂單" },
  { id: "PENDING", label: "待付款" },
  { id: "SHIPPED", label: "待出貨" },
  { id: "DELIVERED", label: "待收貨" },
  { id: "COMPLETED", label: "已完成" },
  { id: "CANCELLED", label: "已取消" },
] as const;

type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "COMPLETED";
type OrderTabId = (typeof ORDER_TABS)[number]["id"];
type ActionItem = { label: string; variant: "solid" | "outline" };
type OrderItem = { img: string; price: number; qty: number };
type FormattedOrder = {
  id: string;
  status: string;
  statusKey: OrderStatus;
  total: number;
  items: OrderItem[];
  actions: ActionItem[];
};

const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    PENDING: "待付款",
    SHIPPED: "待出貨",
    DELIVERED: "待收貨",
    CANCELLED: "已取消",
    COMPLETED: "已完成",
  };
  return labels[status] ?? status;
};

const getActionsByStatus = (status: OrderStatus): ActionItem[] => {
  if (status === "PENDING") return [{ label: "取消訂單", variant: "solid" }];
  if (status === "DELIVERED") return [{ label: "確認收貨", variant: "solid" }, { label: "評價", variant: "outline" }];
  return [{ label: "查看詳情", variant: "outline" }];
};

const isOrderTabId = (value: string | null): value is OrderTabId => {
  if (!value) return false;
  return ORDER_TABS.some((tab) => tab.id === value);
};

const OrderListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<OrderTabId>(() => {
    const status = searchParams.get("status");
    return isOrderTabId(status) ? status : "all";
  });
  const [orders, setOrders] = useState<FormattedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const status = searchParams.get("status");
    setActiveTab(isOrderTabId(status) ? status : "all");
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = (await OrderService.getOrders(controller.signal)) as Array<{
          id: number | string;
          status: OrderStatus;
          totalAmount: number;
          items: Array<{ price: number; quantity: number; productVariant?: { imageUrl?: string } }>;
        }>;

        const formattedOrders: FormattedOrder[] = data.map((order) => ({
          id: String(order.id),
          status: getStatusLabel(order.status),
          statusKey: order.status,
          total: order.totalAmount,
          items: order.items.map((item) => ({
            img: item.productVariant?.imageUrl || "https://via.placeholder.com/200",
            price: item.price,
            qty: item.quantity,
          })),
          actions: getActionsByStatus(order.status),
        }));

        setOrders(formattedOrders);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("獲取訂單失敗:", err);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchOrders();
    return () => controller.abort();
  }, []);

  const handleGoBack = () => navigate(-1);
  const handleTabChange = (tabId: OrderTabId) => {
    setActiveTab(tabId);
    if (tabId === "all") {
      setSearchParams({});
      return;
    }
    setSearchParams({ status: tabId });
  };
  const filteredOrders = activeTab === "all" ? orders : orders.filter((o) => o.statusKey === activeTab);

  if (loading) return <div className="order-list__loading">載入中...</div>;

  return (
    <div className="order-list">
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
        </div>
      </header>

      <nav className="order-list__mobile-tabs">
        {ORDER_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`order-list__mobile-tab${activeTab === tab.id ? " order-list__mobile-tab--active" : ""}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <Header variant="order-list" />

      <main className="order-list__main">
        <div className="container">
          <div className="order-list__body">
            <aside className="order-list__sidebar">
              <h2 className="order-list__sidebar-title">我的訂單</h2>
              <ul className="order-list__sidebar-nav">
                {ORDER_TABS.map((tab) => (
                  <li key={tab.id} className="order-list__sidebar-nav-item">
                    <button
                      className={`order-list__sidebar-nav-btn${activeTab === tab.id ? " order-list__sidebar-nav-btn--active" : ""}`}
                      onClick={() => handleTabChange(tab.id)}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <section className="order-list__content">
              <div className="order-list__table-head">
                <span className="order-list__th">訂單編號</span>
                <span className="order-list__th">商品</span>
                <span className="order-list__th">總價</span>
                <span className="order-list__th">狀態</span>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="order-list__empty">目前沒有相關訂單</div>
              ) : (
                filteredOrders.map((order) => (
                  <article key={order.id} className="order-list__order">
                    <div className="order-list__order-header">
                      <span className="order-list__order-header-id">訂單編號：{order.id}</span>
                      <span className={`order-list__order-header-status order-list__order-header-status--${order.statusKey.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="order-list__order-items-mobile">
                      {order.items.map((item, i) => (
                        <div key={`${order.id}-mobile-${item.img}-${i}`} className="order-list__order-item-card">
                          <img className="order-list__order-item-img" src={item.img} alt="商品" />
                          <span className="order-list__order-item-price">
                            ${item.price} ( {item.qty} )
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="order-list__order-row">
                      <span className="order-list__order-id">{order.id}</span>
                      <div className="order-list__order-images">
                        {order.items.map((item, i) => (
                          <img key={`${order.id}-desktop-${item.img}-${i}`} className="order-list__order-thumb" src={item.img} alt="商品" />
                        ))}
                      </div>
                      <span className="order-list__order-total">${order.total}</span>
                      <span className={`order-list__order-status order-list__order-status--${order.statusKey.toLowerCase()}`}>{order.status}</span>
                    </div>

                    <div className="order-list__order-actions">
                      {order.actions.map((action, ai) => (
                        <button key={`${order.id}-${action.label}-${ai}`} className={`order-list__action-btn order-list__action-btn--${action.variant}`}>
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
        <Footer />
      </div>
    </div>
  );
};

export default OrderListPage;

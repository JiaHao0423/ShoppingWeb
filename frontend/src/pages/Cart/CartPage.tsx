import { useEffect, useState } from "react";
import "./CartPage.scss";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header/Header";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CartService from "../../services/cartService";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../constants/routes";
import notify from "../../utils/notify";

type CartUiItem = {
  id: number | string;
  variantId?: number | string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  img: string;
};

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartUiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const data = (await CartService.getCart(signal)) as {
        items?: Array<{
          id: number | string;
          quantity?: number;
          productVariant?: {
            id?: number | string;
            productName?: string;
            color?: string;
            size?: string;
            price?: number | string;
            imageUrl?: string;
          };
        }>;
      };
      const rawItems = data.items || [];

      const formattedItems = rawItems.map(({ id, quantity = 1, productVariant = {} }) => {
        const { id: variantId, productName: name = "未命名商品", color = "無", size = "無", price = 0, imageUrl } = productVariant;

        return {
          id,
          variantId,
          name,
          color,
          size,
          price: +price || 0,
          quantity: +quantity,
          img: imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200",
        };
      });

      setCartItems(formattedItems);
    } catch (err) {
      if (signal?.aborted) return;
      console.error("獲取購物車失敗:", err);
      setError("無法載入購物車，請稍後再試。");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    if (!authLoading) {
      if (isAuthenticated) {
        fetchCart(controller.signal);
      } else {
        navigate(ROUTES.LOGIN);
      }
    }
    return () => controller.abort();
  }, [isAuthenticated, authLoading, navigate]);

  const calculateCartStats = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = 0;
    const total = subtotal - discount;
    return { subtotal, discount, total };
  };

  const handleQuantityChange = async (cartItemId: number | string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await CartService.updateCartItemQuantity(cartItemId, newQuantity);
      setCartItems((prevItems) => prevItems.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item)));
    } catch (err) {
      console.error("更新數量失敗:", err);
      notify.error("更新數量失敗");
    }
  };

  const handleRemoveItem = async (cartItemId: number | string) => {
    if (!notify.confirm("確定要將此商品從購物車移除嗎？")) return;

    try {
      await CartService.removeCartItem(cartItemId);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
    } catch (err) {
      console.error("刪除項目失敗:", err);
      notify.error("刪除失敗");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      notify.info("購物車是空的喔！");
      return;
    }
    navigate(ROUTES.CHECKOUT);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (authLoading || loading) {
    return (
      <div className="cart">
        <Header variant="cart" />
        <div className="cart__loading" style={{ padding: "100px", textAlign: "center" }}>
          載入中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart">
        <Header variant="cart" />
        <div className="cart__error" style={{ padding: "100px", textAlign: "center", color: "red" }}>
          {error}
        </div>
      </div>
    );
  }

  const stats = calculateCartStats();

  return (
    <div className="cart">
      <header className="cart__header">
        <button className="cart__back-btn" onClick={handleGoBack} aria-label="返回">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1 className="cart__title">購物車</h1>
      </header>

      <Header variant="cart" />

      <main className="cart__container">
        <div className="cart__table-header">
          <span className="cart__table-label">商品</span>
          <span className="cart__table-label">價錢</span>
          <span className="cart__table-label">數量</span>
          <span className="cart__table-label">總價</span>
          <span className="cart__table-label"></span>
        </div>

        <div className="cart__list">
          {cartItems.length > 0 ? (
            cartItems.map((item) => <CartItem key={item.id} item={item} onQuantityChange={handleQuantityChange} onRemove={handleRemoveItem} />)
          ) : (
            <div className="cart__empty" style={{ padding: "50px", textAlign: "center", color: "#999" }}>
              您的購物車目前沒有商品
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <CartSummary subtotal={stats.subtotal} discount={stats.discount} total={stats.total} onCheckout={handleCheckout} />
        )}
      </main>

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

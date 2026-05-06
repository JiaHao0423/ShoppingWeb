import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header/Header";
import CartService from "@/services/cartService";
import OrderService from "@/services/orderService";
import "./CheckoutPage.scss";
import { CameraIcon } from "@/components/Icons/Icons";
import { ROUTES } from "@/constants/routes";
import Footer from "@/components/layout/Footer/Footer";
import notify from "@/utils/notify";
import { PageLoading } from "@/components/ui/page-loading";

type CheckoutItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  img: string;
  color?: string;
  size?: string;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CheckoutItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [shippingMethod, setShippingMethod] = useState("home");

  useEffect(() => {
    const controller = new AbortController();

    const fetchCheckoutData = async () => {
      try {
        setLoading(true);
        const data = (await CartService.getCart(controller.signal)) as {
          items?: Array<{
            id: number | string;
            quantity: number;
            productVariant?: {
              productName?: string;
              price?: number | string;
              imageUrl?: string;
              color?: string;
              size?: string;
            };
          }>;
          totalAmount?: number;
        };

        const rawItems = data.items || [];
        const formattedItems = rawItems.map((item) => ({
          id: item.id,
          name: item.productVariant?.productName || "未命名商品",
          price: Number(item.productVariant?.price) || 0,
          quantity: item.quantity,
          img: item.productVariant?.imageUrl || "https://via.placeholder.com/150",
          color: item.productVariant?.color,
          size: item.productVariant?.size,
        }));

        setCartItems(formattedItems);
        setTotalAmount(data.totalAmount || 0);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("獲取結帳資料失敗:", err);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchCheckoutData();
    return () => controller.abort();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      notify.info("購物車內無商品");
      return;
    }

    try {
      setSubmitting(true);
      const finalAddress = shippingAddress || "預設地址 (請於表單填寫)";
      await OrderService.createOrder(finalAddress, paymentMethod.toUpperCase());
      notify.success("訂單已成功建立！");
      navigate(ROUTES.ORDER_COMPLETE);
    } catch (err) {
      console.error("下單失敗:", err);
      notify.error("下單失敗，請檢查資訊是否完整");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoading />;

  return (
    <div className="checkout">
      <header className="checkout__header">
        <button className="checkout__back-btn" onClick={handleGoBack} aria-label="返回">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="checkout__title">付款與運送</h1>
        <div className="checkout__header-icons">
          <button className="checkout__icon" aria-label="幫助">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-.8.6-1.3 1-1.3 2.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
            </svg>
          </button>
          <button className="checkout__icon" aria-label="用戶">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <Header variant="checkout" />

      <main className="checkout__container">
        <div className="checkout__form-area">
          <section className="checkout-group">
            <h2 className="checkout-group__title">付款方式</h2>

            <div className="checkout-group__options">
              <label className="checkout-option">
                <span className="checkout-option__radio-wrapper">
                  <input type="radio" name="payment" value="cod" className="checkout-option__input" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                  <span className="checkout-option__radio" />
                </span>
                <span className="checkout-option__text">
                  <span className="checkout-option__label">貨到付款</span>
                  <span className="checkout-option__sublabel">滿999免運</span>
                </span>
              </label>

              <label className="checkout-option">
                <span className="checkout-option__radio-wrapper">
                  <input type="radio" name="payment" value="transfer" className="checkout-option__input" checked={paymentMethod === "transfer"} onChange={() => setPaymentMethod("transfer")} />
                  <span className="checkout-option__radio" />
                </span>
                <span className="checkout-option__text">
                  <span className="checkout-option__label">轉帳付款</span>
                </span>
              </label>

              <label className="checkout-option checkout-option--active">
                <span className="checkout-option__radio-wrapper">
                  <input type="radio" name="payment" value="credit" className="checkout-option__input" checked={paymentMethod === "credit"} onChange={() => setPaymentMethod("credit")} />
                  <span className="checkout-option__radio" />
                </span>
                <span className="checkout-option__text">
                  <span className="checkout-option__label">信用卡付款</span>
                </span>
              </label>
            </div>

            {paymentMethod === "credit" && (
              <div className="checkout-form">
                <div className="checkout-form__section">
                  <span className="checkout-form__section-label">卡片詳情</span>
                  <div className="checkout-form__field checkout-form__field--icon">
                    <input type="text" className="checkout-form__input" placeholder="卡片詳情" />
                    <span className="checkout-form__input-icon">
                      <CameraIcon className="checkout-form__input-svg" />
                    </span>
                  </div>
                  <div className="checkout-form__row">
                    <div className="checkout-form__field">
                      <input type="text" className="checkout-form__input" placeholder="到期日(MM/YY)" />
                    </div>
                    <div className="checkout-form__field">
                      <input type="text" className="checkout-form__input" placeholder="安全驗證碼" />
                    </div>
                  </div>
                  <div className="checkout-form__field">
                    <input type="text" className="checkout-form__input" placeholder="持卡人名字" />
                  </div>
                </div>

                <div className="checkout-form__section">
                  <span className="checkout-form__section-label">帳單地址</span>
                  <div className="checkout-form__field">
                    <input type="text" className="checkout-form__input" placeholder="地址" />
                  </div>
                  <div className="checkout-form__field">
                    <input type="text" className="checkout-form__input" placeholder="郵遞區號" />
                  </div>
                </div>
              </div>
            )}

            <hr className="checkout-group__divider" />
          </section>

          <section className="checkout-group">
            <h2 className="checkout-group__title">運送方式</h2>

            <div className="checkout-group__options">
              <label className="checkout-option">
                <span className="checkout-option__radio-wrapper">
                  <input type="radio" name="shipping" value="711" className="checkout-option__input" checked={shippingMethod === "711"} onChange={() => setShippingMethod("711")} />
                  <span className="checkout-option__radio" />
                </span>
                <span className="checkout-option__text">
                  <span className="checkout-option__label">7-11取貨</span>
                  <span className="checkout-option__sublabel">滿999免運</span>
                </span>
              </label>

              <label className="checkout-option">
                <span className="checkout-option__radio-wrapper">
                  <input type="radio" name="shipping" value="family" className="checkout-option__input" checked={shippingMethod === "family"} onChange={() => setShippingMethod("family")} />
                  <span className="checkout-option__radio" />
                </span>
                <span className="checkout-option__text">
                  <span className="checkout-option__label">全家取貨</span>
                  <span className="checkout-option__sublabel">滿999免運</span>
                </span>
              </label>

              <label className="checkout-option checkout-option--active">
                <span className="checkout-option__radio-wrapper">
                  <input type="radio" name="shipping" value="home" className="checkout-option__input" checked={shippingMethod === "home"} onChange={() => setShippingMethod("home")} />
                  <span className="checkout-option__radio" />
                </span>
                <span className="checkout-option__text">
                  <span className="checkout-option__label">宅配到府</span>
                </span>
              </label>
            </div>

            {shippingMethod === "home" && (
              <div className="checkout-form">
                <div className="checkout-form__row checkout-form__row--shipping">
                  <div className="checkout-form__field">
                    <span className="checkout-form__section-label">收件人姓名</span>
                    <input type="text" className="checkout-form__input" placeholder="請輸入真實姓名" />
                  </div>
                  <div className="checkout-form__field">
                    <span className="checkout-form__section-label">手機號碼</span>
                    <div className="checkout-form__phone-row">
                      <select className="checkout-form__select">
                        <option value="+886">+886</option>
                      </select>
                      <input type="tel" className="checkout-form__input" placeholder="912345678" />
                    </div>
                  </div>
                </div>
                <div className="checkout-form__field">
                  <span className="checkout-form__section-label">地址</span>
                  <input
                    type="text"
                    className="checkout-form__input"
                    placeholder="請輸入真實地址"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </div>
              </div>
            )}

            <hr className="checkout-group__divider" />
          </section>
        </div>

        <aside className="checkout-summary">
          <h2 className="checkout-summary__title checkout-summary__title--mobile">訂單資訊</h2>
          <h2 className="checkout-summary__title checkout-summary__title--desktop">小計</h2>

          <div className="checkout-summary__product-list">
            {cartItems.map((item) => (
              <div className="checkout-product" key={item.id}>
                <img className="checkout-product__img" src={item.img} alt={item.name} />
                <div className="checkout-product__info">
                  <span className="checkout-product__price">
                    ${item.price} ({item.quantity})
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-summary__details">
            <div className="checkout-summary__row">
              <span>小計</span>
              <span>${totalAmount}</span>
            </div>
            <div className="checkout-summary__row">
              <span>運費</span>
              <span>0</span>
            </div>
            <div className="checkout-summary__row">
              <span>折扣</span>
              <span>0</span>
            </div>
          </div>

          <div className="checkout-summary__total-section">
            <hr className="checkout-summary__divider" />
            <div className="checkout-summary__row checkout-summary__row--total">
              <span>總結</span>
              <span className="checkout-summary__total-price">${totalAmount}</span>
            </div>
            <button className="checkout-summary__next-btn" onClick={handleCheckout} disabled={submitting}>
              {submitting ? "處理中..." : "下一步"}
            </button>
          </div>
        </aside>
      </main>

      <footer className="checkout-footer">
        <span className="checkout-footer__label">總結</span>
        <div className="checkout-footer__right">
          <span className="checkout-footer__price">${totalAmount}</span>
          <button className="checkout-footer__btn" onClick={handleCheckout} disabled={submitting}>
            {submitting ? "處理中..." : "結帳"}
          </button>
        </div>
      </footer>

      <div className="checkout__desktop-footer">
        <Footer />
      </div>
    </div>
  );
};

export default CheckoutPage;

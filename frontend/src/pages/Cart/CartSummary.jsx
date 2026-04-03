/**
 * 購物車摘要元件
 * @param {number} subtotal - 小計
 * @param {number} discount - 折扣
 * @param {number} total - 總計
 * @param {function} onCheckout - 結帳回調
 */
const CartSummary = ({ subtotal, discount, total, onCheckout }) => {
    return (
        <aside className="cart-summary">
            <h2 className="cart-summary__title">小計</h2>
            <div className="cart-summary__row">
                <span>總計</span>
                <span>${subtotal}</span>
            </div>
            <div className="cart-summary__row">
                <span>折扣</span>
                <span>${discount}</span>
            </div>
            <hr className="cart-summary__divider" />
            <div className="cart-summary__row">
                <span>總結</span>
                <span className="cart-summary__row--total">${total}</span>
            </div>
            <button className="cart-summary__next-btn" onClick={onCheckout}>
                下一步
            </button>
        </aside>
    );
};

export default CartSummary;
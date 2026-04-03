import QuantitySelector from "./QuantitySelector.jsx";

/**
 * 購物車項目元件
 * @param {object} item - 商品項目
 * @param {function} onQuantityChange - 數量變更回調
 * @param {function} onRemove - 刪除項目回調
 */
const CartItem = ({ item, onQuantityChange, onRemove }) => {
    const handleIncrease = () => {
        onQuantityChange(item.id, item.quantity + 1);
    };

    const handleDecrease = () => {
        if (item.quantity > 1) {
            onQuantityChange(item.id, item.quantity - 1);
        }
    };

    const handleRemove = () => {
        // 預留空間：實際刪除功能將在此實現
        console.log(`刪除商品 ID: ${item.id}`);
        onRemove(item.id);
    };

    const itemTotal = item.price * item.quantity;

    return (
        <div className="cart-item">
            {/* 複選框 - 行動版 */}
            <div className="cart-item__checkbox-wrapper">
                <input type="checkbox" id={`item-${item.id}`} className="cart-item__checkbox" />
                <label htmlFor={`item-${item.id}`} className="cart-item__checkbox-label"></label>
            </div>

            {/* 商品圖片 */}
            <img src={item.img} alt={item.name} className="cart-item__img" />

            {/* 商品內容 - 行動版 */}
            <div className="cart-item__content">
                <button
                    className="cart-item__remove-btn"
                    onClick={handleRemove}
                    aria-label="刪除商品"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <h3 className="cart-item__name">{item.name}</h3>
                <div className="cart-item__detail">
                    顏色
                    <span className="cart-item__color-dot" style={{ backgroundColor: item.color }} />
                </div>
                <div className="cart-item__detail">
                    尺寸 <span className="cart-item__size-tag">{item.size}</span>
                </div>
                <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    variant="mobile"
                />
                <div className="cart-item__price cart-item__price--mobile">${item.price}</div>
            </div>

            {/* 桌機版顯示 */}
            <div className="cart-item__price cart-item__price--desktop">${item.price}</div>
            <QuantitySelector
                quantity={item.quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                variant="desktop"
            />
            <div className="cart-item__total">${itemTotal}</div>
            <button
                className="cart-item__remove-btn--desktop"
                onClick={handleRemove}
                aria-label="刪除商品"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    );
};

export default CartItem;
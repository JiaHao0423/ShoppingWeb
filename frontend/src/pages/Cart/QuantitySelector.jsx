/**
 * 數量選擇器元件
 * @param {number} quantity - 當前數量
 * @param {function} onIncrease - 增加數量的回調函數
 * @param {function} onDecrease - 減少數量的回調函數
 * @param {string} variant - 變體 ('mobile' 或 'desktop')
 */
const QuantitySelector = ({ quantity, onIncrease, onDecrease, variant = 'mobile' }) => {
    const variantClass = variant === 'desktop' ? 'quantity-selector--desktop' : '';

    return (
        <div className={`quantity-selector ${variantClass}`}>
            <button
                className="quantity-selector__btn quantity-selector__btn--minus"
                onClick={onDecrease}
                aria-label="減少數量"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
            <span className="quantity-selector__value">{quantity}</span>
            <button
                className="quantity-selector__btn quantity-selector__btn--plus"
                onClick={onIncrease}
                aria-label="增加數量"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
        </div>
    );
};

export default QuantitySelector;
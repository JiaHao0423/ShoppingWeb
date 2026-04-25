type QuantitySelectorProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  variant?: "mobile" | "desktop";
};

const QuantitySelector = ({ quantity, onIncrease, onDecrease, variant = "mobile" }: QuantitySelectorProps) => {
  const variantClass = variant === "desktop" ? "quantity-selector--desktop" : "";

  return (
    <div className={`quantity-selector ${variantClass}`}>
      <button className="quantity-selector__btn quantity-selector__btn--minus" onClick={onDecrease} aria-label="減少數量">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <span className="quantity-selector__value">{quantity}</span>
      <button className="quantity-selector__btn quantity-selector__btn--plus" onClick={onIncrease} aria-label="增加數量">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

export default QuantitySelector;

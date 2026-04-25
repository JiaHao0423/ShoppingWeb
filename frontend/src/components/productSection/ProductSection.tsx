import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import "./ProductSection.scss";

type Product = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  imageUrl?: string;
  isHot?: boolean;
};

export type ProductSectionProps = {
  title?: string;
  products?: Product[];
  viewAllLink?: string;
};

const ProductSection = ({ title = "熱銷排行榜", products = [], viewAllLink = "/products" }: ProductSectionProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const checkScrollEnd = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtEnd = element.scrollWidth - element.scrollLeft <= element.clientWidth + 10;
    element.classList.toggle("product-section__scroll--at-end", isAtEnd);
  };

  const scrollToPosition = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const handleProductClick = (productId: Product["id"]) => {
    navigate(`/product/${productId}`);
  };

  const handleViewAll = () => {
    navigate(viewAllLink);
  };

  return (
    <section className="product-section">
      <div className="container">
        <h2 className="product-section__title">{title}</h2>
        <div className="product-section__wrapper">
          <div className="product-section__scroll" ref={scrollRef} onScroll={checkScrollEnd}>
            <div className="product-section__grid">
              {products.map((product) => (
                <article key={product.id} className="product-section__card product-card">
                  <div className="product-card__image-wrapper" onClick={() => handleProductClick(product.id)}>
                    <img src={product.imageUrl || product.image} alt={product.name} className="product-card__image" loading="lazy" />
                    {product.isHot && (
                      <div className="product-card__badge">
                        <span className="product-card__badge-text">熱銷</span>
                      </div>
                    )}
                  </div>

                  <div className="product-card__info">
                    <h3 className="product-card__name" onClick={() => handleProductClick(product.id)}>
                      {product.name}
                    </h3>
                    <div className="product-card__footer">
                      <span className={`product-card__price ${product.isHot ? "product-card__price--red" : ""}`}>
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </article>
              ))}

              <button className="product-section__arrow product-section__arrow--right" onClick={scrollToPosition} aria-label="查看更多">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <button className="product-section__arrow product-section__arrow--bottom" onClick={handleViewAll} aria-label="查看全部">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default ProductSection;

import './ProductSection.scss';
import {useRef} from "react";
import {useNavigate} from "react-router-dom";

const ProductSection = ({
                            title = '熱銷排行榜',
                            products = [],
                            viewAllLink = '/products'
                        }) => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    // 檢查是否滑到底部
    const checkScrollEnd = (e) => {
        const element = e.target;
        const isAtEnd = element.scrollWidth - element.scrollLeft <= element.clientWidth + 10;
        element.classList.toggle('product-section__scroll--at-end', isAtEnd);
    };

    // 滑動到指定位置
    const scrollToPosition = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    // 加入購物車
    const handleAddToCart = (product) => {
        console.log('加入購物車:', product);
        // 這裡可以加入實際的購物車邏輯
    };

    // 查看商品詳情
    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    // 查看全部
    const handleViewAll = () => {
        navigate(viewAllLink);
    };
    return (
        <section className="product-section">
            <div className="container">
                {/* 標題 */}
                <h2 className="product-section__title">{title}</h2>

                {/* 產品列表容器 */}
                <div className="product-section__wrapper">
                    {/* 產品滾動區域 */}
                    <div
                        className="product-section__scroll"
                        ref={scrollRef}
                        onScroll={checkScrollEnd}
                    >
                        <div className="product-section__grid">
                            {products.map((product) => (
                                <article
                                    key={product.id}
                                    className="product-section__card product-card"
                                >
                                    {/* 產品圖片 */}
                                    <div
                                        className="product-card__image-wrapper"
                                        onClick={() => handleProductClick(product.id)}
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-card__image"
                                            loading="lazy"
                                        />

                                        {/* 促銷標籤 */}
                                        {product.isHot && (
                                            <div className="product-card__badge">
                                                <span className="product-card__badge-text">最暢銷</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* 產品資訊 */}
                                    <div className="product-card__info">
                                        <h3
                                            className="product-card__name"
                                            onClick={() => handleProductClick(product.id)}
                                        >
                                            {product.name}
                                        </h3>

                                        <div className="product-card__footer">
                                            <span className={`product-card__price ${product.isHot ? 'product-card__price--red' : ''}`}>${product.price}</span>

                                            <button
                                                className="product-card__cart-button"
                                                onClick={() => handleAddToCart(product)}
                                                aria-label="加入購物車"
                                            >
                                                <svg className="product-card__cart-icon" viewBox="0 0 24 24" fill="none"
                                                     stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}

                            {/* 手機版：右側箭頭按鈕 */}
                            <button
                                className="product-section__arrow product-section__arrow--right"
                                onClick={scrollToPosition}
                                aria-label="查看更多"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>

                {/* 桌面版：底部箭頭按鈕 */}
                <button
                    className="product-section__arrow product-section__arrow--bottom"
                    onClick={handleViewAll}
                    aria-label="查看全部"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
            </div>
        </section>
    )
}

export default ProductSection;
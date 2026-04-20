import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../../services/productService';
import CartService from '../../services/cartService';
import DefaultLayout from '../../components/layout/DefaultLayout';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import './ProductDetailPage.scss';

// SVG Icons
const HeartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const data = await ProductService.getProductById(id);
                console.log('商品原始資料 (含規格):', data); // ✅ Debug Log
                setProduct(data);
                setActiveImage(data.imageUrl || data.image);

                // 預設選擇第一個有庫存的規格
                if (data.variants && data.variants.length > 0) {
                    const firstAvailable = data.variants.find(v => v.stock > 0) || data.variants[0];
                    setSelectedColor(firstAvailable.color);
                    setSelectedSize(firstAvailable.size);
                }
            } catch (err) {
                console.error('獲取商品詳情失敗:', err);
                setError('無法載入商品資訊，請稍後再試。');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [id]);

    // 提取所有不重複的顏色和尺寸（用於渲染按鈕清單）
    const allColors = product ? [...new Set(product.variants.map(v => v.color))] : [];
    const allSizes = product ? [...new Set(product.variants.map(v => v.size))] : [];

    // 根據當前選取的顏色，計算該顏色下「真正可用（有庫存）」的尺寸
    const availableSizesForCurrentColor = product
        ? product.variants
            .filter(v => v.color === selectedColor && v.stock > 0)
            .map(v => v.size)
        : [];

    // 強制連動邏輯：當顏色改變時，如果當前尺寸不可用，自動切換
    useEffect(() => {
        if (product && selectedColor) {
            console.log(`切換顏色至: ${selectedColor}, 可用尺寸:`, availableSizesForCurrentColor);

            if (!availableSizesForCurrentColor.includes(selectedSize)) {
                if (availableSizesForCurrentColor.length > 0) {
                    console.log(`尺寸 ${selectedSize} 不可用，自動切換至: ${availableSizesForCurrentColor[0]}`);
                    setSelectedSize(availableSizesForCurrentColor[0]);
                } else {
                    setSelectedSize(null);
                }
            }
        }
    }, [selectedColor, product]);

    // 處理數量增減
    const handleQuantityChange = (type) => {
        if (type === 'minus' && quantity > 1) {
            setQuantity(prev => prev - 1);
        } else if (type === 'plus') {
            setQuantity(prev => prev + 1);
        }
    };

    // 加入購物車邏輯
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            alert('請先登入會員');
            navigate(ROUTES.LOGIN);
            return;
        }

        const variant = product.variants.find(
            v => v.color === selectedColor && v.size === selectedSize
        );

        if (!variant || variant.stock <= 0) {
            alert('該規格目前缺貨中');
            return;
        }

        try {
            await CartService.addOrUpdateCartItem(variant.id, quantity);
            alert('已成功加入購物車！');
        } catch (err) {
            console.error('加入購物車失敗:', err);
            alert('加入購物車失敗，請稍後再試。');
        }
    };

    if (loading) return <DefaultLayout><div className="product-detail__loading">載入中...</div></DefaultLayout>;
    if (error) return <DefaultLayout><div className="product-detail__error">{error}</div></DefaultLayout>;
    if (!product) return <DefaultLayout><div className="product-detail__error">找不到該商品</div></DefaultLayout>;

    return (
        <DefaultLayout>
            <div className="product-detail">
                <div className="product-detail__container">
                    <div className="product-detail__media">
                        <div className="product-detail__main-image">
                            <img src={activeImage} alt={product.name} />
                        </div>
                    </div>

                    <div className="product-detail__info">
                        <nav className="product-detail__breadcrumb">
                            <span>首頁</span> / <span>{product.categoryName || '商品詳情'}</span>
                        </nav>

                        <h1 className="product-detail__title">{product.name}</h1>
                        <div className="product-detail__price-row">
                            <span className="product-detail__price">${product.price}</span>
                        </div>

                        <div className="product-detail__description">
                            <p>{product.description || '這是一件高品質的商品，適合各種場合穿搭。'}</p>
                        </div>

                        <div className="product-detail__options">
                            {/* 顏色選擇 */}
                            <div className="product-detail__option-group">
                                <h3 className="product-detail__option-title">顏色: {selectedColor}</h3>
                                <div className="product-detail__color-list">
                                    {allColors.map(color => {
                                        // 檢查該顏色是否有任何庫存
                                        const hasStock = product.variants.some(v => v.color === color && v.stock > 0);
                                        return (
                                            <button
                                                key={color}
                                                className={`product-detail__color-item ${selectedColor === color ? 'is-active' : ''} ${!hasStock ? 'is-out-of-stock' : ''}`}
                                                onClick={() => setSelectedColor(color)}
                                                disabled={!hasStock}
                                            >
                                                <span className="product-detail__color-name">{color}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 尺寸選擇 */}
                            <div className="product-detail__option-group">
                                <h3 className="product-detail__option-title">尺寸: {selectedSize || '請選擇'}</h3>
                                <div className="product-detail__size-list">
                                    {allSizes.map(size => {
                                        // 關鍵判斷：該尺寸在當前顏色下是否有庫存
                                        const isAvailable = availableSizesForCurrentColor.includes(size);
                                        return (
                                            <button
                                                key={size}
                                                className={`product-detail__size-item ${selectedSize === size ? 'is-active' : ''} ${!isAvailable ? 'is-disabled' : ''}`}
                                                onClick={() => isAvailable && setSelectedSize(size)}
                                                disabled={!isAvailable}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 數量選擇 */}
                            <div className="product-detail__option-group">
                                <h3 className="product-detail__option-title">數量</h3>
                                <div className="product-detail__quantity-selector">
                                    <button className="product-detail__quantity-btn" onClick={() => handleQuantityChange('minus')}>-</button>
                                    <input type="number" className="product-detail__quantity-input" value={quantity} readOnly />
                                    <button className="product-detail__quantity-btn" onClick={() => handleQuantityChange('plus')}>+</button>
                                </div>
                            </div>
                        </div>

                        <div className="product-detail__actions">
                            <button className="product-detail__add-cart-btn" onClick={handleAddToCart}>加入購物車</button>
                            <button className="product-detail__wishlist-btn"><HeartIcon />收藏商品</button>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ProductDetailPage;
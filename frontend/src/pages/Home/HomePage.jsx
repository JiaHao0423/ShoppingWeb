import React, { useEffect, useState } from 'react';
import DefaultLayout from "../../components/layout/DefaultLayout.jsx";
import Carousel from "../../components/carousel/Carousel.jsx";
import ProductSection from "../../components/productSection/ProductSection.jsx";
import ProductService from '../../services/productService.js';


const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // 獲取第一頁的商品，每頁 8 個
                const response = await ProductService.getProducts(null, 0, 8);
                setProducts(response.content);
            } catch (err) {
                setError('取得產品資訊失敗，請稍後再試。');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>載入中...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <DefaultLayout>
            <Carousel/>
            {/* 熱銷排行榜 */}
            <ProductSection
                title="熱銷商品"
                products={products}
                viewAllLink="/hot-products"
            />

            {/* 新品上架 */}
            <ProductSection
                title="新品推薦"
                products={products}
                viewAllLink="/new-arrivals"
            />
        </DefaultLayout>
    )
}

export default HomePage
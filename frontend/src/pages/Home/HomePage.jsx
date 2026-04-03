import React, { useEffect, useState } from 'react';
import DefaultLayout from "../../components/layout/DefaultLayout.jsx";
import Carousel from "../../components/carousel/Carousel.jsx";
import ProductSection from "../../components/productSection/ProductSection.jsx";
import ProductService from '../../services/productService';
import { Link } from 'react-router-dom';


const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // 獲取第一頁的商品，每頁 8 個
                const response = await ProductService.getAllProducts(null, 0, 8);
                setProducts(response.content); // Spring Data JPA Page 物件的內容在 content 屬性中
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
            // 123
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    // const hotProducts = [
    //     {
    //         id: 1,
    //         name: '女士短袖襯衫',
    //         price: 590,
    //         image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
    //         isHot: true
    //     }
    // ];

    // 新品上架資料
    // const newProducts = [
    //     {
    //         id: 9,
    //         name: '女士格紋襯衫',
    //         price: 790,
    //         image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop',
    //         isHot: false
    //     },
    // ];
    return (
        <DefaultLayout>
            <Carousel/>
            {/* 熱銷排行榜 */}
            <ProductSection
                title="熱銷排行榜"
                products={products}
                viewAllLink="/hot-products"
            />

            {/* 新品上架 */}
            <ProductSection
                title="新品上架"
                products={products}
                viewAllLink="/new-arrivals"
            />
        </DefaultLayout>
    )
}

export default HomePage
import DefaultLayout from "../../components/layout/DefaultLayout.jsx";
import ProductSection from "../../components/productSection/ProductSection.jsx";
import {useState} from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import './SearchPage.scss';

const SearchPage = () => {
    const [filters, setFilters] = useState({
        category: '',
        color: '',
        size: '',
        priceRange: [0, 10000]
    });

    // 模擬商品資料
    const allProducts = [
        {
            id: 1,
            name: '女士短袖襯衫',
            price: 590,
            category: 'tops',
            color: 'white',
            size: 'm',
            image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
            isHot: true
        },
        {
            id: 2,
            name: '女士連帽外套',
            price: 1290,
            category: 'outerwear',
            color: 'black',
            size: 'l',
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
            isHot: false
        },
        {
            id: 3,
            name: '女士寬鬆襯衫',
            price: 690,
            category: 'tops',
            color: 'blue',
            size: 's',
            image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600&h=800&fit=crop',
            isHot: true
        },
        {
            id: 4,
            name: '女士吊帶背心',
            price: 490,
            category: 'tops',
            color: 'black',
            size: 'm',
            image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop',
            isHot: false
        },
        {
            id: 5,
            name: '女士針織外套',
            price: 1590,
            category: 'outerwear',
            color: 'green',
            size: 'l',
            image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
            isHot: false
        },
        {
            id: 6,
            name: '女士長袖上衣',
            price: 650,
            category: 'tops',
            color: 'white',
            size: 's',
            image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&h=800&fit=crop',
            isHot: true
        },
        {
            id: 7,
            name: '女士套裝外套',
            price: 1990,
            category: 'outerwear',
            color: 'red',
            size: 'xl',
            image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop',
            isHot: false
        },
        {
            id: 8,
            name: '女士休閒襯衫',
            price: 590,
            category: 'tops',
            color: 'blue',
            size: 'm',
            image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&h=800&fit=crop',
            isHot: true
        },
        {
            id: 9,
            name: '女士連身裙',
            price: 1890,
            category: 'dresses',
            color: 'red',
            size: 'm',
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
            isHot: false
        },
        {
            id: 10,
            name: '女士長裙',
            price: 990,
            category: 'bottoms',
            color: 'black',
            size: 's',
            image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop',
            isHot: true
        },
        {
            id: 11,
            name: '女士牛仔褲',
            price: 790,
            category: 'bottoms',
            color: 'blue',
            size: 'm',
            image: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&h=800&fit=crop',
            isHot: false
        },
        {
            id: 12,
            name: '女士短褲',
            price: 490,
            category: 'bottoms',
            color: 'white',
            size: 's',
            image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=800&fit=crop',
            isHot: true
        }
    ];

    // 處理篩選變更
    const handleFilterChange = (newFilters) => {
        if (newFilters.reset) {
            setFilters({
                category: '',
                color: '',
                size: '',
                priceRange: [0, 10000]
            });
        } else {
            setFilters(prev => ({
                ...prev,
                ...newFilters
            }));
        }
    };

    // 根據篩選條件過濾商品
    const filteredProducts = allProducts.filter(product => {
        // 類別篩選
        if (filters.category && product.category !== filters.category) {
            return false;
        }

        // 顏色篩選
        if (filters.color && product.color !== filters.color) {
            return false;
        }

        // 尺寸篩選
        if (filters.size && product.size !== filters.size) {
            return false;
        }

        // 價格篩選
        return !(product.price < filters.priceRange[0] || product.price > filters.priceRange[1]);


    });
    return (
        <DefaultLayout variant="search">
            <div className="search-page">
                <div className="search-page__layout">
                    {/* 側邊欄 */}
                    <Sidebar onFilterChange={handleFilterChange}/>

                    {/* 主要內容區 */}
                    <div className="search-page__main">

                        {/* 商品列表 */}
                        {filteredProducts.length > 0 ? (
                            <ProductSection
                                title=""
                                products={filteredProducts}
                                viewAllLink="#"
                            />
                        ) : (
                            <div className="search-page__empty">
                                <svg className="search-page__empty-icon" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="m21 21-4.35-4.35"/>
                                </svg>
                                <h2 className="search-page__empty-title">找不到符合的商品</h2>
                                <p className="search-page__empty-description">
                                    請嘗試調整篩選條件或使用其他關鍵字搜尋
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default SearchPage;
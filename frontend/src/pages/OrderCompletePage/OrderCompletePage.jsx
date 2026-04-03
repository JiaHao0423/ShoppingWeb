import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header/Header.jsx';
import Footer from '../../components/layout/Footer/Footer.jsx';
import { ROUTES } from '../../constants/routes.js';
import './OrderCompletePage.scss';

/**
 * 訂單完成頁面元件
 * 結帳成功後顯示付款成功訊息，並提供繼續瀏覽商品的按鈕
 */
const OrderCompletePage = () => {
    const navigate = useNavigate();

    /**
     * 返回上一頁
     */
    const handleGoBack = () => {
        navigate(-1);
    };

    /**
     * 導航至首頁瀏覽商品
     */
    const handleBrowseProducts = () => {
        navigate(ROUTES.HOME);
    };

    return (
        <div className="order-complete">
            {/* 行動版頂部 Header */}
            <header className="order-complete__header">
                <button
                    className="order-complete__back-btn"
                    onClick={handleGoBack}
                    aria-label="返回"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <h1 className="order-complete__title">訂單完成</h1>
                <div className="order-complete__header-icons">
                    <button className="order-complete__icon" aria-label="幫助">
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                            <path
                                d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-.8.6-1.3 1-1.3 2.3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <circle cx="12" cy="17" r="1" fill="currentColor" />
                        </svg>
                    </button>
                    <button className="order-complete__icon" aria-label="用戶">
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                            <path
                                d="M4 20c0-4 4-6 8-6s8 2 8 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>
            </header>

            {/* 桌面版 Header */}
            <Header variant="order-complete" />

            {/* 主內容區域 */}
            <main className="order-complete__content">
                <div className="order-complete__message">
                    {/* 成功圖標 */}
                    <div className="order-complete__icon-wrapper">
                        <svg
                            className="order-complete__success-icon"
                            viewBox="0 0 64 64"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="#4CAF50"
                                strokeWidth="3"
                            />
                            <path
                                d="M20 33L28 41L44 25"
                                stroke="#4CAF50"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* 付款成功文字 */}
                    <h2 className="order-complete__heading">付款成功</h2>

                    {/* 逛逛其他商品按鈕 */}
                    <button
                        className="order-complete__browse-btn"
                        onClick={handleBrowseProducts}
                    >
                        逛逛其他商品
                    </button>
                </div>
            </main>

            {/* 桌面版 Footer */}
            <div className="order-complete__desktop-footer">
                <Footer />
            </div>
        </div>
    );
};

export default OrderCompletePage;
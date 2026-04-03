import React, {useState, useCallback} from 'react';
import './Header.scss';
import {Link, useNavigate} from 'react-router-dom';
import clsx from 'clsx';
import Logo from '../../../assets/header/logo.svg';

// 導入子組件
import HamburgerButton from './HamburgerButton';
import SearchBar from './SearchBar';
import HeaderIcons from './HeaderIcons';
import DropdownMenu from './DropdownMenu';
import DesktopMenu from './DesktopMenu';

// 導入常量
import {MENU_CATEGORIES, IMAGE_CATEGORIES} from '../../../constants/menuData.js';
import {ROUTES} from '../../../constants/routes.js';

/**
 * Header 主組件
 * @param {Object} props
 * @param {string} props.variant - 頁面變體（'default' 或 'search'）
 */
const Header = ({variant = 'default'}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('tops');
    const navigate = useNavigate();

    // 判斷是否在搜尋頁面
    const isSearchPage = variant === 'search';

    /**
     * 切換菜單開啟/關閉
     */
    const toggleMenu = useCallback(() => {
        setIsMenuOpen((prev) => {
            const newState = !prev;
            // 菜單打開時重置到第一個分類
            if (newState) {
                setActiveTab('tops');
            }
            return newState;
        });
    }, []);

    /**
     * 處理分類標籤點擊
     */
    const handleTabClick = useCallback((tabId) => {
        setActiveTab(tabId);
    }, []);

    /**
     * 處理菜單項目點擊
     */
    const handleItemClick = useCallback(
        (path) => {
            navigate(path);
            setIsMenuOpen(false);
        },
        [navigate]
    );

    /**
     * 處理返回按鈕點擊
     */
    const handleBackClick = useCallback(() => {
        window.history.back();
    }, []);

    /**
     * 處理搜尋
     */
    const handleSearch = useCallback(
        (query) => {
            if (!query.trim()) return;
            navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`);
            setIsMenuOpen(false);
        },
        [navigate]
    );

    /**
     * 處理會員中心點擊
     */
    const handleMemberClick = useCallback(() => {
        navigate(ROUTES.MEMBER);
    }, [navigate]);

    // 根類名
    const rootClass = clsx('header', `header--${variant}`, {
        'header--orange': isMenuOpen,
    });

    const wrapperClass = clsx('header__wrapper', {
        'header__wrapper--search': isSearchPage,
    });

    return (
        <header className={rootClass}>
            <div className="container">
                <div className={wrapperClass}>
                    {/* 漢堡選單按鈕 */}
                    <HamburgerButton
                        isOpen={isMenuOpen}
                        isSearchPage={isSearchPage}
                        onClick={toggleMenu}
                    />

                    {/* 返回按鈕（搜尋頁面） */}
                    {isSearchPage && (
                        <button
                            className="header__current-button"
                            aria-label="上一頁"
                            onClick={handleBackClick}
                        >
                            <svg
                                className="header__current-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M16.5 3.25 L7.75 12 L16.5 20.75"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    )}

                    {/* Logo */}
                    <Link
                        to={ROUTES.HOME}
                        className={clsx('header__logo', {
                            'header__logo--search': isSearchPage,
                        })}
                        aria-label="回到首頁"
                    >
                        <div className="header__logo-box">
                            <img src={Logo} alt="logo" />
                        </div>
                    </Link>

                    {/* 搜尋區域（搜尋頁面） */}
                    {isSearchPage && (
                        <SearchBar onSearch={handleSearch}/>
                    )}

                    {/* 頭部圖標 */}
                    <HeaderIcons
                        isMenuOpen={isMenuOpen}
                        isSearchPage={isSearchPage}
                        onSearchClick={() => navigate(ROUTES.SEARCH)}
                        onCartClick={() => navigate(ROUTES.CART)}
                        onMemberClick={handleMemberClick}
                    />
                </div>
            </div>

            {/* 移動版下拉選單 */}
            <DropdownMenu
                isOpen={isMenuOpen}
                activeTab={activeTab}
                categories={MENU_CATEGORIES}
                images={IMAGE_CATEGORIES}
                onTabClick={handleTabClick}
                onItemClick={handleItemClick}
            />

            {/* 桌面版下拉選單 */}
            <DesktopMenu
                isOpen={isMenuOpen}
                categories={MENU_CATEGORIES}
                images={IMAGE_CATEGORIES}
                onItemClick={handleItemClick}
            />
        </header>
    );
};

export default Header;
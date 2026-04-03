import clsx from 'clsx';
import { SearchIcon, CartIcon, UserIcon } from '../../Icons/Icons.jsx';

/**
 * 頭部圖標組件
 * @param {Object} props
 * @param {boolean} props.isMenuOpen - 菜單是否開啟
 * @param {boolean} props.isSearchPage - 是否在搜尋頁面
 * @param {Function} props.onSearchClick - 搜尋按鈕點擊回調
 * @param {Function} props.onCartClick - 購物車按鈕點擊回調
 * @param {Function} props.onMemberClick - 會員按鈕點擊回調
 */
const HeaderIcons = ({
                         isMenuOpen,
                         isSearchPage,
                         onSearchClick,
                         onCartClick,
                         onMemberClick,
                     }) => {
    const iconsClass = clsx('header__icons', {
        'header__icons--search': isSearchPage,
    });

    // 圖標按鈕配置
    const iconButtons = [
        {
            id: 'cart',
            label: '購物車',
            icon: CartIcon,
            onClick: onCartClick,
        },
        {
            id: 'member',
            label: '會員中心',
            icon: UserIcon,
            onClick: onMemberClick,
        },
    ];

    return (
        <div className={iconsClass}>
            <button
                key='search'
                className={clsx('header__icon', {
                    'header__icon--white': isMenuOpen,
                    'header__icon--search': isSearchPage
                })}
                aria-label='搜尋'
                onClick={onSearchClick}
                type="button"
            >
                <SearchIcon />
            </button>
            {iconButtons.map(({ id, label, icon: Icon, onClick }) => (
                <button
                    key={id}
                    className={clsx('header__icon', {
                        'header__icon--white': isMenuOpen,
                    })}
                    aria-label={label}
                    onClick={onClick}
                    type="button"
                >
                    <Icon />
                </button>
            ))}
        </div>
    );
};

export default HeaderIcons;
import clsx from 'clsx';

/**
 * 漢堡選單按鈕組件
 * @param {Object} props
 * @param {boolean} props.isOpen - 菜單是否開啟
 * @param {boolean} props.isSearchPage - 是否在搜尋頁面
 * @param {Function} props.onClick - 點擊回調
 */
const HamburgerButton = ({ isOpen, isSearchPage, onClick }) => {
    const buttonClass = clsx('header__hamburger', {
        'header__hamburger--active': isOpen,
        'header__hamburger--search': isSearchPage,
    });

    const lineClass = clsx('header__hamburger-line', {
        'header__hamburger-line--white': isOpen,
    });

    return (
        <button
            className={buttonClass}
            onClick={onClick}
            aria-label="切換選單"
            aria-expanded={isOpen}
            type="button"
        >
            <span className={lineClass} />
            <span className={lineClass} />
            <span className={lineClass} />
        </button>
    );
};

export default HamburgerButton;
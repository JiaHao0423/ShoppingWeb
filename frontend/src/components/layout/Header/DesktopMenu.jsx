import clsx from 'clsx';

/**
 * 桌面版下拉選單組件
 * @param {Object} props
 * @param {boolean} props.isOpen - 菜單是否開啟
 * @param {Array} props.categories - 菜單分類列表
 * @param {Array} props.images - 圖片列表
 * @param {Function} props.onItemClick - 菜單項目點擊回調
 */
const DesktopMenu = ({ isOpen, categories, images, onItemClick }) => {
    const dropdownClass = clsx('header__dropdown--desktop', {
        'header__dropdown--open': isOpen,
    });

    return (
        <nav className={dropdownClass}>
            <div className="header-menu">
                {categories.map((category) => (
                    <div key={category.id} className="header__column">
                        <h4 className="header__column-title">{category.name}</h4>
                        <ul className="header__list">
                            {category.items.map((item) => (
                                <li key={item.path} className="header__list-item">
                                    <button
                                        className="header__list-link"
                                        onClick={() => onItemClick(item.path)}
                                        type="button"
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* 圖片展示區域 */}
            <div className="header__imagebox">
                {images.map((image) => (
                    <div key={image.src} className="header__image-container">
                        <img
                            src={image.src}
                            alt={image.title}
                            className="header__image"
                        />
                    </div>
                ))}
            </div>
        </nav>
    );
};

export default DesktopMenu;
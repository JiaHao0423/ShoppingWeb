import clsx from 'clsx';

/**
 * 移動版下拉選單組件
 * @param {Object} props
 * @param {boolean} props.isOpen - 菜單是否開啟
 * @param {string} props.activeTab - 當前活躍的分類 ID
 * @param {Array} props.categories - 菜單分類列表
 * @param {Array} props.images - 圖片列表
 * @param {Function} props.onTabClick - 分類標籤點擊回調
 * @param {Function} props.onItemClick - 菜單項目點擊回調
 */
const DropdownMenu = ({
                          isOpen,
                          activeTab,
                          categories,
                          images,
                          onTabClick,
                          onItemClick,
                      }) => {
    const dropdownClass = clsx('header__dropdown', {
        'header__dropdown--open': isOpen,
    });

    return (
        <nav className={dropdownClass}>
            <div className="container">
                {/* 主分類 Tabs */}
                <div className="header__tabs" role="tablist">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            role="tab"
                            aria-selected={activeTab === category.id}
                            aria-controls={`panel-${category.id}`}
                            className={clsx('header__tab', {
                                'header__tab--active': activeTab === category.id,
                            })}
                            onClick={() => onTabClick(category.id)}
                            type="button"
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* 子分類內容面板 */}
                <div className="header__content">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            id={`panel-${category.id}`}
                            role="tabpanel"
                            aria-labelledby={category.id}
                            className={clsx('header__panel', {
                                'header__panel--active': activeTab === category.id,
                            })}
                        >
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
            </div>
        </nav>
    );
};

export default DropdownMenu;
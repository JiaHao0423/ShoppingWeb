import clsx from "clsx";

type MenuItem = {
  name: string;
  path: string;
};

type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

type DropdownMenuProps = {
  isOpen: boolean;
  activeTab: string;
  categories: MenuCategory[];
  images: unknown[];
  onTabClick: (tabId: string) => void;
  onItemClick: (path: string) => void;
};

const DropdownMenu = ({ isOpen, activeTab, categories, onTabClick, onItemClick }: DropdownMenuProps) => {
  const dropdownClass = clsx("header__dropdown", {
    "header__dropdown--open": isOpen,
  });

  return (
    <nav className={dropdownClass}>
      <div className="container">
        <div className="header__tabs" role="tablist">
          {categories.map((category) => (
            <button
              key={category.id}
              role="tab"
              aria-selected={activeTab === category.id}
              aria-controls={`panel-${category.id}`}
              className={clsx("header__tab", { "header__tab--active": activeTab === category.id })}
              onClick={() => onTabClick(category.id)}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="header__content">
          {categories.map((category) => (
            <div
              key={category.id}
              id={`panel-${category.id}`}
              role="tabpanel"
              aria-labelledby={category.id}
              className={clsx("header__panel", { "header__panel--active": activeTab === category.id })}
            >
              <ul className="header__list">
                {category.items.map((item) => (
                  <li key={item.path} className="header__list-item">
                    <button className="header__list-link" onClick={() => onItemClick(item.path)} type="button">
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

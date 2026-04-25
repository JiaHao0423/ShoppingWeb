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

type MenuImage = {
  src: string;
  title: string;
};

type DesktopMenuProps = {
  isOpen: boolean;
  categories: MenuCategory[];
  images: MenuImage[];
  onItemClick: (path: string) => void;
};

const DesktopMenu = ({ isOpen, categories, images, onItemClick }: DesktopMenuProps) => {
  const dropdownClass = clsx("header__dropdown--desktop", {
    "header__dropdown--open": isOpen,
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
                  <button className="header__list-link" onClick={() => onItemClick(item.path)} type="button">
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="header__imagebox">
        {images.map((image) => (
          <div key={image.src} className="header__image-container">
            <img src={image.src} alt={image.title} className="header__image" />
          </div>
        ))}
      </div>
    </nav>
  );
};

export default DesktopMenu;

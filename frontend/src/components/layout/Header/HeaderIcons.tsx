import clsx from "clsx";
import { CartIcon, SearchIcon, UserIcon } from "../../Icons/Icons";

type HeaderIconsProps = {
  isMenuOpen: boolean;
  isSearchPage: boolean;
  onSearchClick: () => void;
  onCartClick: () => void;
  onMemberClick: () => void;
};

const HeaderIcons = ({ isMenuOpen, isSearchPage, onSearchClick, onCartClick, onMemberClick }: HeaderIconsProps) => {
  const iconsClass = clsx("header__icons", {
    "header__icons--search": isSearchPage,
  });

  const iconButtons = [
    { id: "cart", label: "購物車", icon: CartIcon, onClick: onCartClick },
    { id: "member", label: "會員中心", icon: UserIcon, onClick: onMemberClick },
  ];

  return (
    <div className={iconsClass}>
      <button
        key="search"
        className={clsx("header__icon", {
          "header__icon--white": isMenuOpen,
          "header__icon--search": isSearchPage,
        })}
        aria-label="搜尋"
        onClick={onSearchClick}
        type="button"
      >
        <SearchIcon />
      </button>
      {iconButtons.map(({ id, label, icon: Icon, onClick }) => (
        <button
          key={id}
          className={clsx("header__icon", {
            "header__icon--white": isMenuOpen,
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

import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import "./Header.scss";
import Logo from "../../../assets/header/logo.svg";
import { useAuth } from "../../../contexts/AuthContext";
import HamburgerButton from "./HamburgerButton";
import SearchBar from "./SearchBar";
import HeaderIcons from "./HeaderIcons";
import DropdownMenu from "./DropdownMenu";
import DesktopMenu from "./DesktopMenu";
import { MENU_CATEGORIES, IMAGE_CATEGORIES } from "../../../constants/menuData.js";
import { ROUTES } from "../../../constants/routes";

type HeaderProps = {
  variant?: string;
};

const Header = ({ variant = "default" }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tops");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isSearchPage = variant === "search";

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => {
      const newState = !prev;
      if (newState) {
        setActiveTab("tops");
      }
      return newState;
    });
  }, []);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const handleItemClick = useCallback(
    (path: string) => {
      navigate(path);
      setIsMenuOpen(false);
    },
    [navigate]
  );

  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      if (!query.trim()) return;
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`);
      setIsMenuOpen(false);
    },
    [navigate]
  );

  const handleMemberClick = useCallback(() => {
    navigate(isAuthenticated ? ROUTES.MEMBER : ROUTES.LOGIN);
  }, [navigate, isAuthenticated]);

  const rootClass = clsx("header", `header--${variant}`, {
    "header--orange": isMenuOpen,
  });

  const wrapperClass = clsx("header__wrapper", {
    "header__wrapper--search": isSearchPage,
  });

  return (
    <header className={rootClass}>
      <div className="container">
        <div className={wrapperClass}>
          <HamburgerButton isOpen={isMenuOpen} isSearchPage={isSearchPage} onClick={toggleMenu} />

          {isSearchPage && (
            <button className="header__current-button" aria-label="上一頁" onClick={handleBackClick}>
              <svg className="header__current-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

          <Link
            to={ROUTES.HOME}
            className={clsx("header__logo", { "header__logo--search": isSearchPage })}
            aria-label="回到首頁"
          >
            <div className="header__logo-box">
              <img src={Logo} alt="logo" />
            </div>
          </Link>

          {isSearchPage && <SearchBar onSearch={handleSearch} />}

          <HeaderIcons
            isMenuOpen={isMenuOpen}
            isSearchPage={isSearchPage}
            onSearchClick={() => navigate(ROUTES.SEARCH)}
            onCartClick={() => navigate(ROUTES.CART)}
            onMemberClick={handleMemberClick}
          />
        </div>
      </div>

      <DropdownMenu
        isOpen={isMenuOpen}
        activeTab={activeTab}
        categories={MENU_CATEGORIES}
        images={IMAGE_CATEGORIES}
        onTabClick={handleTabClick}
        onItemClick={handleItemClick}
      />

      <DesktopMenu isOpen={isMenuOpen} categories={MENU_CATEGORIES} images={IMAGE_CATEGORIES} onItemClick={handleItemClick} />
    </header>
  );
};

export default Header;

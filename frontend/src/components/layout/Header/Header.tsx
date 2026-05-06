import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import "./Header.scss";
import Logo from "@/assets/header/logo.svg";
import { useAuth } from "@/contexts/AuthContext";
import HamburgerButton from "./HamburgerButton";
import SearchBar from "./SearchBar";
import HeaderIcons from "./HeaderIcons";
import DropdownMenu from "./DropdownMenu";
import DesktopMenu from "./DesktopMenu";
import { MENU_CATEGORIES } from "@/constants/menuData.js";
import { IMAGE_CATEGORIES } from "@/constants/menuData.js";
import { ROUTES } from "@/constants/routes";
import ProductService from "@/services/productService";

type HeaderProps = {
  variant?: string;
};

type HeaderMenuCategory = {
  id: string;
  name: string;
  items: Array<{ name: string; path: string }>;
};

const normalizeParentCategory = (value?: string | null): "tops" | "bottoms" | "onePiece" | "others" => {
  if (!value) return "others";
  if (value === "tops" || value === "bottoms" || value === "onePiece" || value === "others") return value;
  return "others";
};

const buildGroupedMenu = (categories: Array<{ id: number; name: string; parentCategory?: string | null }>): HeaderMenuCategory[] => {
  const groupedItems: Record<"tops" | "bottoms" | "onePiece" | "others", Array<{ name: string; path: string }>> = {
    tops: [],
    bottoms: [],
    onePiece: [],
    others: [],
  };

  categories.forEach((category) => {
    const bucket = normalizeParentCategory(category.parentCategory);
    groupedItems[bucket].push({
      name: category.name,
      path: `${ROUTES.SEARCH}?categoryId=${category.id}`,
    });
  });

  const groups: HeaderMenuCategory[] = [
    { id: "tops", name: "上衣", items: groupedItems.tops },
    { id: "bottoms", name: "下身", items: groupedItems.bottoms },
    { id: "onePiece", name: "連身", items: groupedItems.onePiece },
    { id: "others", name: "其他", items: groupedItems.others },
  ];

  return groups.filter((group) => group.items.length > 0);
};

const Header = ({ variant = "default" }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [menuCategories, setMenuCategories] = useState<HeaderMenuCategory[]>([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isSearchPage = variant === "search";

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        const categories = (await ProductService.getAllCategories()) as Array<{ id: number; name: string; parentCategory?: string | null }>;
        const normalized = buildGroupedMenu(categories);
        setMenuCategories(normalized);
        if (normalized.length > 0) {
          setActiveTab(normalized[0].id);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load header categories:", error);
      }
    };

    fetchCategories();
    return () => controller.abort();
  }, []);

  const fallbackCategories = useMemo(
    () =>
      MENU_CATEGORIES.map((category) => ({
        id: category.id,
        name: category.name,
        items: category.items.map((item) => ({ name: item.name, path: item.path })),
      })),
    []
  );
  const categories = menuCategories.length > 0 ? menuCategories : fallbackCategories;

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => {
      const newState = !prev;
      if (newState && categories.length > 0) {
        setActiveTab(categories[0].id);
      }
      return newState;
    });
  }, [categories]);

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
        categories={categories}
        images={IMAGE_CATEGORIES}
        onTabClick={handleTabClick}
        onItemClick={handleItemClick}
      />

      <DesktopMenu isOpen={isMenuOpen} categories={categories} images={IMAGE_CATEGORIES} onItemClick={handleItemClick} />
    </header>
  );
};

export default Header;

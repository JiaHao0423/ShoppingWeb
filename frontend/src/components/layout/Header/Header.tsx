import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Menu } from "lucide-react";
import MagnifierIcon from "@/components/Icons/itshover/magnifier-icon";
import ShoppingCartIcon from "@/components/Icons/itshover/shopping-cart-icon";
import UserIcon from "@/components/Icons/itshover/user-icon";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import MobileMenu, { type MobileMenuCategory } from "./MobileMenu";
import { MENU_CATEGORIES } from "@/constants/menuData.js";
import { ROUTES } from "@/constants/routes";
import { HOME_NAV_LINKS } from "@/constants/homeContent";
import ProductService from "@/services/productService";

type HeaderProps = {
  variant?: string;
};

const MINIMAL_VARIANTS = new Set(["cart", "checkout", "order-complete", "member", "order-list", "auth"]);

const normalizeParentCategory = (value?: string | null): "tops" | "bottoms" | "onePiece" | "others" => {
  if (!value) return "others";
  if (value === "tops" || value === "bottoms" || value === "onePiece" || value === "others") return value;
  return "others";
};

const buildGroupedMenu = (categories: Array<{ id: number; name: string; parentCategory?: string | null }>): MobileMenuCategory[] => {
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

  return [
    { id: "tops", name: "上衣", items: groupedItems.tops },
    { id: "bottoms", name: "下身", items: groupedItems.bottoms },
    { id: "onePiece", name: "連身", items: groupedItems.onePiece },
    { id: "others", name: "其他", items: groupedItems.others },
  ].filter((group) => group.items.length > 0);
};

const LogoMark = ({ light = false }: { light?: boolean }) => (
  <span className={`site-header__logo-text${light ? " site-header__logo-text--light" : ""}`}>NY 選品</span>
);

const Header = ({ variant = "default" }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuCategories, setMenuCategories] = useState<MobileMenuCategory[]>([]);
  const { isAuthenticated } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();

  const isSearchPage = variant === "search";
  const isMinimal = MINIMAL_VARIANTS.has(variant);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCategories = async () => {
      try {
        const categories = (await ProductService.getAllCategories()) as Array<{
          id: number;
          name: string;
          parentCategory?: string | null;
        }>;
        setMenuCategories(buildGroupedMenu(categories));
      } catch (error) {
        if (!controller.signal.aborted) console.error("Failed to load header categories:", error);
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

  const handleItemClick = useCallback(
    (path: string) => {
      navigate(path);
      setIsMenuOpen(false);
    },
    [navigate]
  );

  const handleSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(trimmed)}`);
      setIsMenuOpen(false);
    },
    [navigate]
  );

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const openMenu = () => setIsMenuOpen(true);

  const ActionIcons = ({ light = false }: { light?: boolean }) => (
    <div className={`site-header__end${light ? " site-header__end--light" : ""}`}>
      {!isSearchPage && (
        <button type="button" className="site-header__icon-btn" onClick={() => navigate(ROUTES.SEARCH)} aria-label="搜尋">
          <MagnifierIcon />
        </button>
      )}
      <button type="button" className="site-header__icon-btn site-header__icon-btn--cart" onClick={() => navigate(ROUTES.CART)} aria-label="購物車">
        <ShoppingCartIcon />
        <span className="site-header__cart-badge">{cartItemsCount > 99 ? "99+" : cartItemsCount}</span>
      </button>
      <button
        type="button"
        className="site-header__icon-btn site-header__icon-btn--account"
        onClick={() => navigate(isAuthenticated ? ROUTES.MEMBER : ROUTES.LOGIN)}
        aria-label="帳戶"
      >
        <UserIcon />
      </button>
    </div>
  );

  if (isMinimal) {
    return (
      <header className="site-header site-header--minimal">
        <div className="site-header__shell">
          <div className="site-header__bar">
            <div className="site-header__start" />
            <Link to={ROUTES.HOME} className="site-header__logo" aria-label="回到首頁">
              <LogoMark light />
            </Link>
            <ActionIcons light />
          </div>
        </div>
      </header>
    );
  }

  if (isSearchPage) {
    return (
      <>
        <header className="site-header">
          <div className="site-header__shell">
            <div className="site-header__bar site-header__bar--search">
              <button type="button" className="site-header__icon-btn site-header__icon-btn--back" onClick={() => window.history.back()} aria-label="上一頁">
                <ChevronLeft />
              </button>
              <button type="button" className="site-header__icon-btn site-header__icon-btn--menu-desktop" onClick={openMenu} aria-label="開啟選單">
                <Menu />
              </button>
              <form onSubmit={handleSearchSubmit} className="site-header__search-form">
                <MagnifierIcon className="site-header__search-icon" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋商品..."
                  className="site-header__search-input"
                  autoFocus
                />
              </form>
              <Link to={ROUTES.HOME} className="site-header__logo site-header__logo--inline" aria-label="回到首頁">
                <LogoMark />
              </Link>
              <ActionIcons />
            </div>
          </div>
        </header>
        <MobileMenu open={isMenuOpen} categories={categories} onClose={() => setIsMenuOpen(false)} onItemClick={handleItemClick} />
      </>
    );
  }

  return (
    <>
      <header className="site-header">
        <div className="site-header__shell">
          <div className="site-header__bar">
            <div className="site-header__start">
              <button type="button" className="site-header__icon-btn site-header__icon-btn--menu" onClick={openMenu} aria-label="開啟選單">
                <Menu />
              </button>
              <nav className="site-header__nav" aria-label="主要導覽">
                {HOME_NAV_LINKS.map((link) => (
                  <Link key={link.label} to={link.path} className="site-header__nav-link">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <Link to={ROUTES.HOME} className="site-header__logo" aria-label="回到首頁">
              <LogoMark />
            </Link>
            <ActionIcons />
          </div>
        </div>
      </header>
      <MobileMenu open={isMenuOpen} categories={categories} onClose={() => setIsMenuOpen(false)} onItemClick={handleItemClick} />
    </>
  );
};

export default Header;

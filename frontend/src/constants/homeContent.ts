import { ROUTES } from "@/constants/routes";
import { UNSPLASH_IMAGES } from "@/constants/unsplashImages";

export const HOME_NAV_LINKS = [
  { label: "新品上市", path: ROUTES.SEARCH },
  { label: "熱銷商品", path: ROUTES.SEARCH },
  { label: "服裝", path: ROUTES.SEARCH },
] as const;

export const HOME_MOBILE_NAV_LINKS = [
  { label: "新品上市", path: ROUTES.SEARCH },
  { label: "熱銷商品", path: ROUTES.SEARCH },
  { label: "服裝", path: ROUTES.SEARCH },
  { label: "配件", path: ROUTES.SEARCH },
  { label: "關於我們", path: ROUTES.ABOUT },
] as const;

export const HOME_CATEGORY_TILES = [
  { label: "新品上市", path: ROUTES.SEARCH, image: UNSPLASH_IMAGES.categoryTile(0) },
  { label: "洋裝", path: "/products/dresses", image: UNSPLASH_IMAGES.categoryTile(1) },
  { label: "上衣", path: "/products/t-shirt", image: UNSPLASH_IMAGES.categoryTile(2) },
  { label: "褲裝", path: "/products/jeans", image: UNSPLASH_IMAGES.categoryTile(3) },
] as const;

export const HOME_INSTAGRAM_IMAGES = [
  UNSPLASH_IMAGES.socialSquare(0),
  UNSPLASH_IMAGES.socialSquare(1),
  UNSPLASH_IMAGES.socialSquare(2),
  UNSPLASH_IMAGES.socialSquare(3),
] as const;

export const HOME_FOOTER_CATEGORY_LINKS = [
  { label: "新品上市", path: ROUTES.SEARCH },
  { label: "洋裝", path: "/products/dresses" },
  { label: "上衣", path: "/products/t-shirt" },
  { label: "褲裝", path: "/products/jeans" },
] as const;

export const HOME_FOOTER_SERVICE_LINKS = [
  { label: "聯絡我們", path: ROUTES.CONTACT },
  { label: "運送說明", href: "#" },
  { label: "退換貨政策", href: "#" },
  { label: "FAQ", href: "#" },
] as const;

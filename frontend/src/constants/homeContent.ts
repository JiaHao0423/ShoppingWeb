import { ROUTES } from "@/constants/routes";

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
  {
    label: "新品上市",
    path: ROUTES.SEARCH,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop",
  },
  {
    label: "洋裝",
    path: "/products/dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop",
  },
  {
    label: "上衣",
    path: "/products/t-shirt",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop",
  },
  {
    label: "褲裝",
    path: "/products/jeans",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop",
  },
] as const;

export const HOME_INSTAGRAM_IMAGES = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
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

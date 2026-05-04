/**
 * 集中管理所有路由路徑，便於維護和重構
 */
export const ROUTES = {
  HOME: "/home",
  SEARCH: "/search",
  CART: "/cart",
  MEMBER: "/member",

  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  PROFILE: "/member/profile",
  ORDERS: "/orders",
  WISHLIST: "/member/wishlist",

  CHECKOUT: "/checkout",
  ORDER_COMPLETE: "/order-complete",
  ABOUT: "/about",
  CONTACT: "/contact",
  /** 管理員：商品分類維護 */
  ADMIN_CATEGORIES: "/admin/categories",
} as const;

/**
 * 根據 URL 參數生成搜尋路由
 */
export const getSearchRoute = (query: string): string => `${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`;

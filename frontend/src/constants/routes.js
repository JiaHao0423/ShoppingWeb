/**
 * 集中管理所有路由路徑，便於維護和重構
 */
export const ROUTES = {
    // 主要頁面
    HOME: '/home',
    SEARCH: '/search',
    CART: '/cart',
    MEMBER: '/member',

    // 用戶相關
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/member/profile',
    ORDERS: '/orders',
    WISHLIST: '/member/wishlist',

    // 其他
    CHECKOUT: '/checkout',
    ORDER_COMPLETE: '/order-complete',
    ABOUT: '/about',
    CONTACT: '/contact',
};

/**
 * 根據 URL 參數生成搜尋路由
 * @param {string} query - 搜尋查詢字符串
 * @returns {string} 完整的搜尋 URL
 */
export const getSearchRoute = (query) => {
    return `${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`;
};
import React from 'react';

/**
 * 搜尋圖標
 */
export const SearchIcon = ({ className = 'header__search-icon' }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

/**
 * 購物車圖標
 */
export const CartIcon = ({ className = 'header__icon-svg' }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

/**
 * 用戶圖標
 */
export const UserIcon = ({ className = 'header__icon-svg' }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
);

/**
 * 相機圖標
 */
export const CameraIcon = ({ className = 'header__camera-icon' }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M8 6L9.5 4H14.5L16 6" />
        <circle cx="12" cy="13" r="3" />
    </svg>
);

/**
 * 返回圖標
 */
export const BackIcon = ({ className = 'header__current-icon' }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16.5 3.25 L7.75 12 L16.5 20.75" />
    </svg>
);
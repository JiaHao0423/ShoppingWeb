import Image01 from '../assets/header/image01.png';
import Image02 from '../assets/header/image02.png';
import Image03 from '../assets/header/image03.png';

/**
 * 菜單分類資料
 * 包含所有分類及其子項目
 */
export const MENU_CATEGORIES = [
    {
        id: 'tops',
        name: '上衣',
        items: [
            { name: 'T恤', path: '/products/t-shirt' },
            { name: '襯衫', path: '/products/shirt' },
            { name: '毛衣', path: '/products/sweater' },
        ],
    },
    {
        id: 'bottoms',
        name: '下身',
        items: [
            { name: '牛仔褲', path: '/products/jeans' },
            { name: '短褲', path: '/products/shorts' },
            { name: '裙子', path: '/products/skirt' },
        ],
    },
    {
        id: 'onePiece',
        name: '連身',
        items: [
            { name: '洋裝', path: '/products/dresses' },
            { name: '連身褲', path: '/products/jumpsuit' },
            { name: '外套', path: '/products/jackets' },
            { name: '防曬衣', path: '/products/sunscreen-clothing' },
        ],
    },
];

/**
 * 圖片分類資料
 * 用於桌面版下拉選單的圖片展示
 */
export const IMAGE_CATEGORIES = [
    {
        src: Image01,
        title: '季節特賣 限時優惠',
    },
    {
        src: Image02,
        title: '熱銷商品 限時免運',
    },
    {
        src: Image03,
        title: '會員專享 折扣優惠',
    },
];
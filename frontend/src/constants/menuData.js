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
            { name: '設計類上衣', path: '/products/designer-tops' },
        ],
    },
    {
        id: 'bottoms',
        name: '下身',
        items: [
            { name: '長褲', path: '/products/long-pants' },
            { name: '短褲', path: '/products/shorts' },
            { name: '裙子', path: '/products/skirt' },
        ],
    },
    {
        id: 'onePiece',
        name: '連身',
        items: [
            { name: '外套', path: '/products/dress' },
            { name: '西裝外套', path: '/products/jumpsuit' },
            { name: '針織外套', path: '/products/cardigan' },
            { name: '抗UV防曬外套', path: '/products/uv-jacket' },
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
        title: '新年限定 7 折優惠',
    },
    {
        src: Image02,
        title: '人氣商品限時免運',
    },
    {
        src: Image03,
        title: '會員獨享折扣專區',
    },
];
/**
 * 全站圖片來源：Unsplash 免費圖（https://unsplash.com）
 * 使用 images.unsplash.com CDN，依場景帶入尺寸參數。
 */

const BASE = "https://images.unsplash.com";

type UnsplashSize = {
  w?: number;
  h?: number;
  fit?: "crop" | "max";
  q?: number;
};

/** 組出 Unsplash 圖片 URL（photo id 為網址中 photo- 後面的片段） */
export function unsplashUrl(photoId: string, size: UnsplashSize = {}): string {
  const params = new URLSearchParams();
  if (size.w != null) params.set("w", String(size.w));
  if (size.h != null) params.set("h", String(size.h));
  if (size.fit) params.set("fit", size.fit);
  params.set("auto", "format");
  if (size.q != null) params.set("q", String(size.q));
  const qs = params.toString();
  return `${BASE}/${photoId}${qs ? `?${qs}` : ""}`;
}

/** 時尚／服飾類商品圖池（依 id 分配，避免列表全同一張） */
export const UNSPLASH_PRODUCT_PHOTOS = [
  "photo-1515886657613-9f3515b0c78f",
  "photo-1595777457583-95e059d581b8",
  "photo-1434389677669-e08b4cac3105",
  "photo-1541099649105-f69ad21f3246",
  "photo-1483985988355-763728e1935b",
  "photo-1469334031218-e382a71b716b",
  "photo-1558618666-fcd25c85cd64",
  "photo-1445205170230-053b83016050",
  "photo-1529626455594-4ff0802cfb7e",
  "photo-1591047139829-d91aecb6caea",
  "photo-1485462537746-965f33f7f6a7",
  "photo-1539533011282-433bada7ad79",
] as const;

export const UNSPLASH_IMAGES = {
  /** 商品卡片／列表預設 */
  product: (id?: string | number | null) =>
    unsplashUrl(pickProductPhoto(id), { w: 400, h: 500, fit: "crop", q: 80 }),

  /** 購物車、訂單縮圖 */
  productThumb: (id?: string | number | null) =>
    unsplashUrl(pickProductPhoto(id), { w: 200, h: 200, fit: "crop", q: 80 }),

  /** 結帳明細 */
  productCheckout: (id?: string | number | null) =>
    unsplashUrl(pickProductPhoto(id), { w: 150, h: 150, fit: "crop", q: 80 }),

  /** 會員頭像 */
  avatar: unsplashUrl("photo-1529626455594-4ff0802cfb7e", { w: 200, h: 200, fit: "crop", q: 80 }),

  /** 首頁 Hero */
  hero: (index: number) =>
    unsplashUrl(UNSPLASH_HERO_PHOTOS[index % UNSPLASH_HERO_PHOTOS.length], {
      w: 1920,
      h: 1080,
      fit: "crop",
      q: 85,
    }),

  /** 首頁橫幅 */
  banner: unsplashUrl("photo-1445205170230-053b83016050", { w: 1920, h: 800, fit: "crop", q: 85 }),

  /** 分類方塊 3:4 */
  categoryTile: (index: number) =>
    unsplashUrl(UNSPLASH_CATEGORY_PHOTOS[index % UNSPLASH_CATEGORY_PHOTOS.length], {
      w: 400,
      h: 600,
      fit: "crop",
      q: 80,
    }),

  /** Instagram 方塊 */
  socialSquare: (index: number) =>
    unsplashUrl(UNSPLASH_SOCIAL_PHOTOS[index % UNSPLASH_SOCIAL_PHOTOS.length], {
      w: 400,
      h: 400,
      fit: "crop",
      q: 80,
    }),

  /** Header 選單推廣圖 */
  menuPromo: (index: number) =>
    unsplashUrl(UNSPLASH_MENU_PHOTOS[index % UNSPLASH_MENU_PHOTOS.length], {
      w: 600,
      h: 400,
      fit: "crop",
      q: 80,
    }),

  /** 舊輪播元件（若仍使用） */
  carousel: (index: number) =>
    unsplashUrl(UNSPLASH_CAROUSEL_PHOTOS[index % UNSPLASH_CAROUSEL_PHOTOS.length], {
      w: 1920,
      h: 900,
      fit: "crop",
      q: 85,
    }),
} as const;

const UNSPLASH_HERO_PHOTOS = [
  "photo-1483985988355-763728e1935b",
  "photo-1469334031218-e382a71b716b",
  "photo-1558618666-fcd25c85cd64",
] as const;

const UNSPLASH_CATEGORY_PHOTOS = [
  "photo-1515886657613-9f3515b0c78f",
  "photo-1595777457583-95e059d581b8",
  "photo-1434389677669-e08b4cac3105",
  "photo-1541099649105-f69ad21f3246",
] as const;

const UNSPLASH_SOCIAL_PHOTOS = [
  "photo-1483985988355-763728e1935b",
  "photo-1469334031218-e382a71b716b",
  "photo-1541099649105-f69ad21f3246",
  "photo-1558618666-fcd25c85cd64",
] as const;

const UNSPLASH_MENU_PHOTOS = [
  "photo-1483985988355-763728e1935b",
  "photo-1469334031218-e382a71b716b",
  "photo-1558618666-fcd25c85cd64",
] as const;

const UNSPLASH_CAROUSEL_PHOTOS = [
  "photo-1483985988355-763728e1935b",
  "photo-1469334031218-e382a71b716b",
  "photo-1558618666-fcd25c85cd64",
  "photo-1445205170230-053b83016050",
  "photo-1515886657613-9f3515b0c78f",
] as const;

function pickProductPhoto(id?: string | number | null): string {
  if (id == null || id === "") return UNSPLASH_PRODUCT_PHOTOS[0];
  const n = typeof id === "number" ? id : Number.parseInt(String(id), 10);
  const idx = Number.isFinite(n) ? Math.abs(n) % UNSPLASH_PRODUCT_PHOTOS.length : 0;
  return UNSPLASH_PRODUCT_PHOTOS[idx];
}

/** 是否為 Unsplash CDN 圖片 */
export function isUnsplashImage(url?: string | null): boolean {
  return Boolean(url?.includes("images.unsplash.com"));
}

/**
 * 統一解析商品／頭像等圖片：非 Unsplash 或空值時改用 Unsplash 圖池。
 */
export function resolveImageUrl(
  url: string | undefined | null,
  fallback: (id?: string | number | null) => string,
  entityId?: string | number | null
): string {
  if (url && isUnsplashImage(url)) return url;
  return fallback(entityId);
}

export function resolveProductImageUrl(imageUrl?: string | null, productId?: string | number | null): string {
  return resolveImageUrl(imageUrl, UNSPLASH_IMAGES.product, productId);
}

export function resolveProductThumbUrl(imageUrl?: string | null, productId?: string | number | null): string {
  return resolveImageUrl(imageUrl, UNSPLASH_IMAGES.productThumb, productId);
}

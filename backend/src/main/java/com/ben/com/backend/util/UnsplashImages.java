package com.ben.com.backend.util;

/**
 * 全站商品圖預設來源：Unsplash 免費圖（https://unsplash.com）
 */
public final class UnsplashImages {

  private static final String BASE = "https://images.unsplash.com";

  private static final String[] PRODUCT_PHOTOS = {
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
  };

  private UnsplashImages() {}

  public static boolean isUnsplashUrl(String url) {
    return url != null && url.contains("images.unsplash.com");
  }

  public static String productImage(Long productId) {
    int idx = 0;
    if (productId != null) {
      idx = Math.floorMod(productId.intValue(), PRODUCT_PHOTOS.length);
    }
    return BASE + "/" + PRODUCT_PHOTOS[idx] + "?w=400&h=500&fit=crop&auto=format&q=80";
  }

  public static String resolveProductImage(String imageUrl, Long productId) {
    if (isUnsplashUrl(imageUrl)) {
      return imageUrl;
    }
    return productImage(productId);
  }

  public static String resolveVariantImage(String imageUrl, Long productId) {
    return resolveProductImage(imageUrl, productId);
  }
}

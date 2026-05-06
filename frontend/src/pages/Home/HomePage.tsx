import { useEffect, useState } from "react";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Carousel from "@/components/carousel/Carousel";
import ProductSection, { type ProductSectionItem } from "@/components/productSection/ProductSection";
import ProductService from "@/services/productService";
import { PageLoading } from "@/components/ui/page-loading";

type ProductListResponse = {
  content: ProductSectionItem[];
};

const HomePage = () => {
  const [products, setProducts] = useState<ProductSectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = (await ProductService.getProducts(null, 0, 8, controller.signal)) as ProductListResponse;
        setProducts(response.content ?? []);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError("取得產品資訊失敗，請稍後再試。");
        console.error("Error fetching products:", err);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <DefaultLayout>
      <Carousel />
      <ProductSection title="熱銷商品" products={products} viewAllLink="/hot-products" />
      <ProductSection title="新品推薦" products={products} viewAllLink="/new-arrivals" />
    </DefaultLayout>
  );
};
export default HomePage;

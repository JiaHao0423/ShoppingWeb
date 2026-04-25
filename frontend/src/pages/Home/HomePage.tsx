import { ComponentType, useEffect, useState } from "react";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Carousel from "../../components/carousel/Carousel";
import ProductSection from "../../components/productSection/ProductSection";
import ProductService from "../../services/productService";

type ProductListResponse = {
  content: any[];
};
type ProductSectionProps = {
  title?: string;
  products?: any[];
  viewAllLink?: string;
};

const HomePage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const TypedProductSection = ProductSection as unknown as ComponentType<ProductSectionProps>;

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
    return <div>載入中...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <DefaultLayout>
      <Carousel />
      <TypedProductSection title="熱銷商品" products={products} viewAllLink="/hot-products" />
      <TypedProductSection title="新品推薦" products={products} viewAllLink="/new-arrivals" />
    </DefaultLayout>
  );
};

export default HomePage;

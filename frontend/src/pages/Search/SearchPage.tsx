import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DefaultLayout from "@/components/layout/DefaultLayout";
import ProductSection from "@/components/productSection/ProductSection";
import Sidebar from "@/components/sidebar/Sidebar";
import ProductService from "@/services/productService";
import { PageLoading } from "@/components/ui/page-loading";
import "./SearchPage.scss";

/** URL path segment（如 /products/jeans）對應到 Sidebar 篩選用的 value */
const CATEGORY_SLUG_TO_FILTER: Record<string, string> = {
  "t-shirt": "tops",
  shirt: "tops",
  sweater: "tops",
  jeans: "bottoms",
  shorts: "bottoms",
  skirt: "bottoms",
  dresses: "dresses",
  jumpsuit: "dresses",
  jackets: "outerwear",
  "sunscreen-clothing": "outerwear",
};

type Filters = {
  category: string;
  color: string;
  size: string;
  priceRange: [number, number];
};

type Product = {
  id: number;
  name: string;
  price: number;
  categoryId: string;
  categoryName: string;
  color: string;
  size: string;
  image: string;
  isHot: boolean;
};

const SearchPage = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams] = useSearchParams();
  const categoryIdFromQuery = searchParams.get("categoryId") ?? "";
  const categoryFromQuery = searchParams.get("category") ?? "";
  const keyword = (searchParams.get("q") ?? "").trim().toLowerCase();

  const resolvedInitialCategory = useMemo(() => {
    if (categoryIdFromQuery) return categoryIdFromQuery;
    if (categoryFromQuery) return categoryFromQuery;
    if (!categorySlug) return "";
    return CATEGORY_SLUG_TO_FILTER[categorySlug] ?? "";
  }, [categoryIdFromQuery, categoryFromQuery, categorySlug]);

  const [filters, setFilters] = useState<Filters>({
    category: resolvedInitialCategory,
    color: "",
    size: "",
    priceRange: [0, 10000],
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, category: resolvedInitialCategory }));
  }, [resolvedInitialCategory]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSearchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesResponse, productsResponse] = (await Promise.all([
          ProductService.getAllCategories(),
          ProductService.getProducts(null, 0, 200, controller.signal),
        ])) as [
          Array<{ id: number; name: string }>,
          { content?: Array<{ id: number; name: string; price: number | string; imageUrl?: string; category?: { id: number; name: string } }> }
        ];

        const normalizedCategories = categoriesResponse.map((category) => ({
          value: String(category.id),
          label: category.name,
        }));
        setCategoryOptions(normalizedCategories);

        const normalizedProducts: Product[] = (productsResponse.content ?? []).map((product) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          categoryId: String(product.category?.id ?? ""),
          categoryName: product.category?.name ?? "",
          color: "",
          size: "",
          image: product.imageUrl ?? "https://via.placeholder.com/200",
          isHot: false,
        }));
        setProducts(normalizedProducts);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Error fetching search data:", err);
        setError("取得商品資訊失敗，請稍後再試。");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSearchData();
    return () => controller.abort();
  }, []);
  const handleFilterChange = (newFilters: Partial<Filters> & { reset?: boolean }) => {
    if (newFilters.reset) {
      setFilters({ category: "", color: "", size: "", priceRange: [0, 10000] });
    } else {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    }
  };

  const filteredProducts = products.filter((product) => {
    if (filters.category && product.categoryId !== filters.category) return false;
    if (filters.color && product.color !== filters.color) return false;
    if (filters.size && product.size !== filters.size) return false;
    if (keyword && !product.name.toLowerCase().includes(keyword)) return false;
    return !(product.price < filters.priceRange[0] || product.price > filters.priceRange[1]);
  });

  const pageTitle = useMemo(() => {
    if (keyword) return `搜尋結果：${searchParams.get("q")}`;
    const currentCategory = categoryOptions.find((option) => option.value === filters.category);
    if (currentCategory) return `${currentCategory.label}分類`;
    return "全部商品";
  }, [filters.category, keyword, searchParams, categoryOptions]);

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <DefaultLayout variant="search">
      <div className="search-page">
        <div className="search-page__layout">
          <Sidebar onFilterChange={handleFilterChange} categories={categoryOptions} />
          <div className="search-page__main">
            {filteredProducts.length > 0 ? (
              <ProductSection title={pageTitle} products={filteredProducts} viewAllLink="#" />
            ) : (
              <div className="search-page__empty">
                <svg className="search-page__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <h2 className="search-page__empty-title">找不到符合的商品</h2>
                <p className="search-page__empty-description">請嘗試調整篩選條件或使用其他關鍵字搜尋</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SearchPage;

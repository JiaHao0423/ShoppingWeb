import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import DefaultLayout from "@/components/layout/DefaultLayout";
import ProductCard from "@/components/home/ProductCard";
import SectionHeading from "@/components/home/SectionHeading";
import type { ProductSectionItem } from "@/components/productSection/ProductSection";
import Sidebar from "@/components/sidebar/Sidebar";
import ProductService from "@/services/productService";
import { PageLoading } from "@/components/ui/page-loading";
import { resolveProductImageUrl } from "@/constants/unsplashImages";
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

type Product = ProductSectionItem & {
  categoryId: string;
  categoryName: string;
  color: string;
  size: string;
};

const SearchPage = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams] = useSearchParams();
  const categoryIdFromQuery = searchParams.get("categoryId") ?? "";
  const categoryFromQuery = searchParams.get("category") ?? "";
  const keyword = (searchParams.get("q") ?? "").trim().toLowerCase();
  const keywordDisplay = (searchParams.get("q") ?? "").trim();

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
          {
            content?: Array<{
              id: number;
              name: string;
              price: number | string;
              imageUrl?: string;
              category?: { id: number; name: string };
            }>;
          },
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
          imageUrl: resolveProductImageUrl(product.imageUrl, product.id),
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

  const hasActiveFilters =
    Boolean(filters.category || filters.color || filters.size) ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 10000;

  const { headingKicker, headingTitle } = useMemo(() => {
    if (keywordDisplay) {
      return { headingKicker: "搜尋結果", headingTitle: `「${keywordDisplay}」` };
    }
    const currentCategory = categoryOptions.find((option) => option.value === filters.category);
    if (currentCategory) {
      return { headingKicker: "分類", headingTitle: currentCategory.label };
    }
    return { headingKicker: "全部商品", headingTitle: "商品一覽" };
  }, [filters.category, keywordDisplay, categoryOptions]);

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return (
      <DefaultLayout variant="search">
        <main className="search">
          <p className="search__error">{error}</p>
        </main>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout variant="search">
      <main className="search">
        <section className="search__header">
          <div className="search__inner">
            <SectionHeading kicker={headingKicker} title={headingTitle} />
            <div className="search__meta">
              <p className="search__count">
                共 <span>{filteredProducts.length}</span> 件商品
              </p>
              {hasActiveFilters && (
                <button type="button" className="search__clear" onClick={() => handleFilterChange({ reset: true })}>
                  清除篩選
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="search__body">
          <div className="search__inner search__layout">
            <div className="search__filters">
              <div className="search__filters-head">
                <SlidersHorizontal aria-hidden />
                <span>篩選條件</span>
              </div>
              <Sidebar
                onFilterChange={handleFilterChange}
                categories={categoryOptions}
                initialCategory={filters.category}
                initialColor={filters.color}
                initialSize={filters.size}
                initialPriceRange={filters.priceRange}
              />
            </div>

            <div className="search__results">
              {filteredProducts.length > 0 ? (
                <div className="search__grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="search__empty">
                  <div className="search__empty-icon-wrap">
                    <Search aria-hidden />
                  </div>
                  <h2 className="search__empty-title">找不到符合的商品</h2>
                  <p className="search__empty-desc">請嘗試調整篩選條件，或使用其他關鍵字搜尋</p>
                  {hasActiveFilters && (
                    <button type="button" className="search__cta" onClick={() => handleFilterChange({ reset: true })}>
                      清除所有篩選
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </DefaultLayout>
  );
};

export default SearchPage;

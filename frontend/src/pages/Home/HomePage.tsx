import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DefaultLayout from "@/components/layout/DefaultLayout";
import HeroCarousel from "@/components/home/HeroCarousel";
import ProductCard from "@/components/home/ProductCard";
import SectionHeading from "@/components/home/SectionHeading";
import type { ProductSectionItem } from "@/components/productSection/ProductSection";
import ProductService from "@/services/productService";
import { ROUTES } from "@/constants/routes";
import { HOME_CATEGORY_TILES, HOME_INSTAGRAM_IMAGES } from "@/constants/homeContent";
import { UNSPLASH_IMAGES } from "@/constants/unsplashImages";
import { PageLoading } from "@/components/ui/page-loading";

type ProductListResponse = {
  content: ProductSectionItem[];
};

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="home__tile-ig-icon" fill="currentColor" aria-hidden>
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-2.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
  </svg>
);

const HomePage = () => {
  const [products, setProducts] = useState<ProductSectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchProducts();
    return () => controller.abort();
  }, []);

  if (loading) return <PageLoading />;

  if (error) {
    return (
      <DefaultLayout>
        <p className="home__error">{error}</p>
      </DefaultLayout>
    );
  }

  const bestSellers = products.slice(0, 4);
  const newArrivals = products.slice(4, 8).length > 0 ? products.slice(4, 8) : products.slice(0, 4);

  return (
    <DefaultLayout>
      <main className="home">
        <HeroCarousel />

        <section className="home__section">
          <div className="home__section-inner">
            <div className="home__grid-4">
              {HOME_CATEGORY_TILES.map((cat) => (
                <Link key={cat.label} to={cat.path} className="home__tile">
                  <img src={cat.image} alt={cat.label} className="home__tile-img" />
                  <div className="home__tile-gradient" />
                  <div className="home__tile-label-wrap">
                    <span className="home__tile-label">{cat.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="home__section home__section--muted">
          <div className="home__section-inner">
            <SectionHeading kicker="店內熱門" title="熱銷商品" />
            <div className="home__grid-4">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="home__section-cta">
              <button type="button" onClick={() => navigate(ROUTES.SEARCH)} className="home__cta home__cta--secondary">
                查看更多
                <ArrowRight aria-hidden />
              </button>
            </div>
          </div>
        </section>

        <section className="home__banner">
          <img
            src={UNSPLASH_IMAGES.banner}
            alt=""
            className="home__banner-img"
          />
          <div className="home__banner-overlay" />
          <div className="home__banner-content">
            <div className="home__banner-copy">
              <p className="home__banner-kicker">本季精選</p>
              <h2 className="home__banner-title">襯衫與針織的週間組合</h2>
              <p className="home__banner-desc">同色系三件套，上班與週末都能直接套用。</p>
              <button type="button" onClick={() => navigate(ROUTES.SEARCH)} className="home__cta home__cta--primary">
                前往選購
                <ArrowRight aria-hidden />
              </button>
            </div>
          </div>
        </section>

        <section className="home__section">
          <div className="home__section-inner">
            <SectionHeading kicker="剛上架" title="新品推薦" />
            <div className="home__grid-4">
              {newArrivals.map((product) => (
                <ProductCard key={`new-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="home__section">
          <div className="home__section-inner">
            <SectionHeading kicker="社群" title="日常穿搭紀錄" align="center" />
            <div className="home__grid-4">
              {HOME_INSTAGRAM_IMAGES.map((src) => (
                <a
                  key={src}
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home__tile home__tile--square"
                >
                  <img src={src} alt="" className="home__tile-img" />
                  <div className="home__tile-ig-overlay">
                    <InstagramIcon />
                    <span className="visually-hidden">Instagram</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </DefaultLayout>
  );
};

export default HomePage;

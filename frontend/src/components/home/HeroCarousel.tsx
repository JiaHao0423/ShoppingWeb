import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { UNSPLASH_IMAGES } from "@/constants/unsplashImages";

const heroSlides = [
  {
    image: UNSPLASH_IMAGES.hero(0),
    kicker: "春夏新裝",
    title: "週末出門的\n一套就夠",
  },
  {
    image: UNSPLASH_IMAGES.hero(1),
    kicker: "本週補貨",
    title: "棉麻與針織\n剛好上架",
  },
  {
    image: UNSPLASH_IMAGES.hero(2),
    kicker: "搭配筆記",
    title: "同色系\n三層穿法",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  return (
    <section className="home__hero" aria-label="主視覺輪播">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.kicker}
          className={`home__hero-slide${index === currentSlide ? " home__hero-slide--active" : ""}`}
          aria-hidden={index !== currentSlide}
        >
          <img src={slide.image} alt="" className="home__hero-img" />
          <div className="home__hero-overlay" />
          <div className="home__hero-content-wrap">
            <div className="home__container">
              <div className="home__hero-copy">
                <p className="home__hero-kicker">{slide.kicker}</p>
                <h1 className="home__hero-title">{slide.title}</h1>
                <p className="home__hero-desc">實穿面料、固定版型，減少每次選購時的猶豫。</p>
                <div className="home__hero-actions">
                  <button type="button" onClick={() => navigate(ROUTES.SEARCH)} className="home__cta home__cta--primary">
                    瀏覽商品
                    <ArrowRight aria-hidden />
                  </button>
                  <button type="button" onClick={() => navigate(ROUTES.SEARCH)} className="home__cta home__cta--ghost-light">
                    查看分類
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="home__hero-controls">
        <button type="button" className="home__hero-nav-btn" onClick={prevSlide} aria-label="上一張">
          <ChevronLeft />
        </button>
        <div className="home__hero-dot-row" role="tablist" aria-label="輪播指示器">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.kicker}
              type="button"
              role="tab"
              aria-selected={index === currentSlide}
              onClick={() => setCurrentSlide(index)}
              className={`home__hero-dot${index === currentSlide ? " home__hero-dot--active" : ""}`}
              aria-label={`第 ${index + 1} 張`}
            />
          ))}
        </div>
        <button type="button" className="home__hero-nav-btn" onClick={nextSlide} aria-label="下一張">
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};

export default HeroCarousel;

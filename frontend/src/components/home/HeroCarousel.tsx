import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop",
    subtitle: "2026 春夏新品",
    title: "優雅，\n是一種態度。",
  },
  {
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1080&fit=crop",
    subtitle: "限時優惠",
    title: "探索你的\n獨特風格",
  },
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop",
    subtitle: "精選系列",
    title: "時尚，\n由你定義。",
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
          key={slide.subtitle}
          className={`home__hero-slide${index === currentSlide ? " home__hero-slide--active" : ""}`}
          aria-hidden={index !== currentSlide}
        >
          <img src={slide.image} alt="" className="home__hero-img" />
          <div className="home__hero-overlay-r" />
          <div className="home__hero-overlay-t" />
          <div className="home__hero-content-wrap">
            <div className="home__container">
              <div className={`home__hero-panel${index === currentSlide ? " home__hero-panel--animate" : ""}`}>
                <p className="home__hero-eyebrow">{slide.subtitle}</p>
                <h1 className="home__hero-title">{slide.title}</h1>
                <p className="home__hero-desc">精選面料與俐落剪裁，為日常注入更高級的質感層次。</p>
                <div className="home__hero-actions">
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.SEARCH)}
                    className="home__cta home__cta--primary home__cta--primary-lg"
                  >
                    探索系列
                    <ArrowRight aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.SEARCH)}
                    className="home__cta home__cta--hero-secondary"
                  >
                    瀏覽全系列
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="home__hero-controls">
        <div className="home__hero-controls-inner">
          <button type="button" className="home__hero-nav-btn" onClick={prevSlide} aria-label="上一張">
            <ChevronLeft />
          </button>
          <div className="home__hero-dot-row" role="tablist" aria-label="輪播指示器">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.subtitle}
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
      </div>
    </section>
  );
};

export default HeroCarousel;

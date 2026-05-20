import { useEffect, useState } from "react";
import "./Carousel.scss";
import { UNSPLASH_IMAGES } from "@/constants/unsplashImages";

type Slide = {
  id: number;
  image: string;
  brand: string;
  title: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
};

const slides: Slide[] = [
  { id: 1, image: UNSPLASH_IMAGES.carousel(0), brand: "不僅是穿搭", title: "時尚，更是一種生活態度。", buttonText: "了解更多", buttonLink: "/home" },
  { id: 2, image: UNSPLASH_IMAGES.carousel(1), brand: "不僅是穿搭", title: "穿出自信，展現真我", buttonText: "探索系列", buttonLink: "/home" },
  { id: 3, image: UNSPLASH_IMAGES.carousel(2), brand: "不僅是穿搭", title: "冬日聰明，穿搭首選", buttonText: "了解更多", buttonLink: "/home" },
  { id: 4, image: UNSPLASH_IMAGES.carousel(3), brand: "不僅是穿搭", title: "打造專屬風格", buttonText: "了解更多", buttonLink: "/home" },
  { id: 5, image: UNSPLASH_IMAGES.carousel(4), brand: "不僅是穿搭", title: "繽紛百搭單品", buttonText: "了解更多", buttonLink: "/home" },
];

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="carousel">
      <div className="carousel__track">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`carousel__slide ${index === currentSlide ? "carousel__slide--active" : ""}`}>
            <div className="carousel__image-wrapper">
              <img src={slide.image} alt={slide.title} className="carousel__image" />
              <div className="carousel__overlay" />
            </div>

            <div className="carousel__content">
              <div className="container">
                <div className="carousel__text">
                  <p className="carousel__brand">{slide.brand}</p>
                  <h2 className="carousel__title">{slide.title}</h2>
                  {slide.description && <p className="carousel__description">{slide.description}</p>}
                  <a href={slide.buttonLink} className="carousel__button">
                    {slide.buttonText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel__dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`carousel__dot ${index === currentSlide ? "carousel__dot--active" : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`切換到第 ${index + 1} 張`}
            type="button"
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;

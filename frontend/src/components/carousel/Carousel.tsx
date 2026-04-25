import { useCallback, useEffect, useState } from "react";
import "./Carousel.scss";
import Image01 from "../../assets/carousel/image01.jpg";
import Image02 from "../../assets/carousel/image02.jpg";
import Image03 from "../../assets/carousel/image03.jpg";
import Image04 from "../../assets/carousel/image04.jpg";
import Image05 from "../../assets/carousel/image05.jpg";

type Slide = {
  id: number;
  image: string;
  brand: string;
  title: string;
  buttonText: string;
  buttonLink: string;
  description?: string;
};

const slides: Slide[] = [
  { id: 1, image: Image01, brand: "不僅是穿搭", title: "時尚，更是一種生活態度。", buttonText: "了解更多", buttonLink: "/home" },
  { id: 2, image: Image02, brand: "不僅是穿搭", title: "穿出自信，展現真我", buttonText: "探索系列", buttonLink: "/home" },
  { id: 3, image: Image03, brand: "不僅是穿搭", title: "冬日聰明，穿搭首選", buttonText: "了解更多", buttonLink: "/home" },
  { id: 4, image: Image04, brand: "不僅是穿搭", title: "打造專屬風格", buttonText: "了解更多", buttonLink: "/home" },
  { id: 5, image: Image05, brand: "不僅是穿搭", title: "繽紛百搭單品", buttonText: "了解更多", buttonLink: "/home" },
];

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext]);

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
            onClick={() => handleDotClick(index)}
            aria-label={`跳到第 ${index + 1} 張`}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;

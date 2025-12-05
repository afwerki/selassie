import { useState, useEffect, useRef } from "react";
import "./Hero.css";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";

import slide1 from "../assets/images/church_inside.png";
import slide2 from "../assets/images/jesus.png";
import slide3 from "../assets/images/mission.jpg";

const heroImages = [slide1, slide2, slide3];

function Hero() {
  const { lang } = useLanguage();
  const t = texts[lang];

  // merge i18n text with local images
  const slides = t.heroSlides.map((s, i) => ({
    ...s,
    image: heroImages[i] || heroImages[0],
  }));

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const heroRef = useRef(null);

  const goTo = (index) => {
    setActive((index + slides.length) % slides.length);
  };

  const goNext = () => goTo(active + 1);
  const goPrev = () => goTo(active - 1);

  // Auto rotate
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goNext, 7000);
    return () => clearInterval(timer);
  }, [active, isPaused]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };

  // Touch swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX == null) return setIsPaused(false);

    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) (diff < 0 ? goNext() : goPrev());

    setTouchStartX(null);
    setIsPaused(false);
  };

  return (
    <section
      className="hero-carousel upgraded-hero"
      id="home"
      ref={heroRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${
            active === index ? "is-active" : "is-inactive"
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
          }}
        />
      ))}

      <div className="hero-gradient-overlay" />

      {/* Floating shapes */}
      <div className="hero-shape hero-shape--cross" />
      <div className="hero-shape hero-shape--triangle" />
      <div className="hero-shape hero-shape--orb" />

      {/* Text panel */}
      <div className="hero-overlay">
        <div className="hero-glass">
          <div className="hero-text-container">
            <h1
              key={slides[active].title}
              className="hero-title slash-reveal amharic-fix"
            >
              {slides[active].title}
            </h1>

            <p
              key={slides[active].subtitle}
              className="hero-subtitle triangle-reveal amharic-fix"
            >
              {slides[active].subtitle}
            </p>

            <div className="hero-actions">
              <a
                href={slides[active].href}
                className="hero-btn hero-btn-primary"
              >
                {slides[active].cta}
              </a>
              <a href="#contact" className="hero-btn hero-btn-ghost">
                {t.hero.btnSecondary}
              </a>
            </div>
          </div>

          {/* slide counter */}
          <div className="hero-counter">
            <span>{String(active + 1).padStart(2, "0")}</span>
            <span className="hero-counter-separator">/</span>
            <span>{String(slides.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      {/* dots */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === active ? "active" : ""}`}
            onClick={() => {
              setIsPaused(true);
              goTo(i);
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;

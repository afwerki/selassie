import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";

import slide1 from "../assets/images/churchAtendes.JPG";
import slide2 from "../assets/images/church7.JPG";
import slide3 from "../assets/images/church9.JPG";

/**
 * ✅ Change these filenames to your real video filenames inside assets/videos
 */
import heroVideo1 from "../assets/videos/selassie_inside.mp4";
import heroVideo2 from "../assets/videos/selassie_inside.mp4";
import heroVideo3 from "../assets/videos/selassie_inside.mp4";

const heroImages = [slide1, slide2, slide3];
const heroVideos = [heroVideo1, heroVideo2, heroVideo3];

function Hero() {
  const { lang } = useLanguage();
  const t = texts[lang];

  const slides = useMemo(() => {
    const fromI18n = t.heroSlides || [];

    if (!fromI18n.length) {
      return [
        {
          eyebrow: "Debre-Genet Holy Trinity",
          title: "DEBRE-GENET HOLY TRINITY ETHIOPIAN ORTHODOX TEWAHEDO CHURCH",
          subtitle:
            "A spiritual home for the Ethiopian Orthodox community in London. Join us in worship, prayer, and fellowship.",
          cta: "Learn More",
          href: "/#about",
          image: heroImages[0],
          video: heroVideos[0],
          position: "center center",
        },
        {
          eyebrow: "Faith • Community • Tradition",
          title: "Rooted in Ancient Wisdom",
          subtitle:
            "Preserving the timeless teachings of the Orthodox faith through worship, fellowship, and spiritual growth.",
          cta: "Watch Sermons",
          href: "/#sermons",
          image: heroImages[1],
          video: heroVideos[1],
          position: "center center",
        },
        {
          eyebrow: "Visit • Worship • Connect",
          title: "Join Us in Prayer and Fellowship",
          subtitle:
            "Explore church life, service times, ministries, and ways to stay connected with the community.",
          cta: "Upcoming Events",
          href: "/#events",
          image: heroImages[2],
          video: heroVideos[2],
          position: "center center",
        },
      ];
    }

    return fromI18n.map((slide, index) => ({
      ...slide,
      image: heroImages[index] || heroImages[0],
      video: heroVideos[index] || null,
      eyebrow: slide.eyebrow || slide.badge || "Debre-Genet Holy Trinity",
      position: slide.position || "center center",
    }));
  }, [t]);

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const videoRefs = useRef([]);

  const total = slides.length;
  const activeSlide = slides[active] || slides[0];

  const goTo = (index) => setActive((index + total) % total);
  const goNext = () => setActive((prev) => (prev + 1) % total);
  const goPrev = () => setActive((prev) => (prev - 1 + total) % total);

  useEffect(() => {
    if (isPaused || total <= 1) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 6500);

    return () => clearInterval(timer);
  }, [isPaused, total]);

  useEffect(() => {
    videoRefs.current.forEach((videoEl, index) => {
      if (!videoEl) return;

      if (index === active) {
        const playPromise = videoEl.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      } else {
        videoEl.pause();
        try {
          videoEl.currentTime = 0;
        } catch {
          // ignore reset errors
        }
      }
    });
  }, [active]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX == null) return;

    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
      diff < 0 ? goNext() : goPrev();
    }
    setTouchStartX(null);
  };

  const primaryTo = activeSlide?.href || "/#about";
  const secondaryTo = "/#contact";

  return (
    <section
      className="hero"
      id="home"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Church hero section"
    >
      <div className="hero__bg" aria-hidden="true">
        {slides.map((slide, index) => {
          const isActive = index === active;

          return (
            <div
              key={`${slide.title}-${index}`}
              className={`hero__bgSlide ${isActive ? "is-active" : ""}`}
            >
              {slide.video ? (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  className="hero__video"
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  poster={slide.image}
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
              ) : (
                <div
                  className="hero__imageFallback"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundPosition: slide.position || "center center",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="hero__overlay hero__overlay--base" aria-hidden="true" />
      <div className="hero__overlay hero__overlay--left" aria-hidden="true" />
      <div className="hero__overlay hero__overlay--glow" aria-hidden="true" />
      <div className="hero__noise" aria-hidden="true" />

      <div className="hero__inner">
        <div className="hero__content">
          <div className="heroText" key={`${lang}-${active}`}>
            <div className="heroText__eyebrow heroAnim heroAnim--1 amharic-fix">
              {activeSlide?.eyebrow}
            </div>

            <h1 className="heroText__title heroAnim heroAnim--2 amharic-fix">
              {activeSlide?.title}
            </h1>

            <p className="heroText__subtitle heroAnim heroAnim--3 amharic-fix">
              {activeSlide?.subtitle}
            </p>

            <div className="heroText__actions heroAnim heroAnim--4">
              <Link to={primaryTo} className="heroBtn heroBtn--primary">
                {activeSlide?.cta}
                <span aria-hidden="true">→</span>
              </Link>

              <Link to={secondaryTo} className="heroBtn heroBtn--ghost">
                {t.hero?.btnSecondary || "Plan Your Visit"}
              </Link>
            </div>

            <div className="heroText__meta heroAnim heroAnim--5">
              <div className="heroText__counter" aria-label="Slide counter">
                <span>{String(active + 1).padStart(2, "0")}</span>
                <span className="heroText__sep">/</span>
                <span>{String(total).padStart(2, "0")}</span>
              </div>
            </div>
          </div>
        </div>

        {total > 1 && (
          <div className="hero__controls" aria-label="Hero carousel controls">
            <button
              type="button"
              className="heroArrow"
              onClick={goPrev}
              aria-label="Previous slide"
            >
              <span aria-hidden="true">‹</span>
            </button>

            <button
              type="button"
              className="heroArrow"
              onClick={goNext}
              aria-label="Next slide"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        )}
      </div>

      {total > 1 && (
        <div className="heroDots" aria-label="Hero slide navigation">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`heroDot ${index === active ? "is-active" : ""}`}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className="heroDot__line" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default Hero;
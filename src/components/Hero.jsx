import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";

import slide1 from "../assets/images/churchAtendes.JPG";
import slide2 from "../assets/images/church7.JPG";
import slide3 from "../assets/images/church9.JPG";

import heroVideo1 from "../assets/videos/kids.mov";
import heroVideo2 from "../assets/videos/church_inside2.MP4";
import heroVideo3 from "../assets/videos/prists.mov";

const heroImages = [slide1, slide2, slide3];
const heroVideos = [heroVideo1, heroVideo2, heroVideo3];
const IMAGE_SLIDE_DURATION = 7000;

function Hero() {
  const { lang } = useLanguage();
  const t = texts[lang];

  const slides = useMemo(() => {
    const fromI18n = t.heroSlides || [];

    const defaultSlides = [
      {
        eyebrow: "Debre-Genet Holy Trinity",
        title: "Debre-Genet Holy Trinity",
        mobileTitle: "Debre-Genet Holy Trinity",
        highlightWords: ["Holy Trinity"],
        subtitle:
          "A spiritual home for the Ethiopian Orthodox community in London. Join us in worship, prayer, and fellowship.",
        mobileSubtitle:
          "A spiritual home for the Ethiopian Orthodox community in London. Join us in worship, prayer, and fellowship.",
        cta: "Learn More",
        href: "/#about",
        image: heroImages[0],
        video: heroVideos[0],
        position: "center center",
      },
      {
        eyebrow: "Ancient Faith • Living Community",
        title: "Rooted in Ancient Wisdom",
        mobileTitle: "Rooted in Ancient Wisdom",
        highlightWords: ["Ancient Wisdom"],
        subtitle:
          "Preserving the timeless teachings of the Orthodox faith through worship, prayer, and spiritual community.",
        mobileSubtitle:
          "Preserving the timeless teachings of the Orthodox faith through worship, prayer, and spiritual community.",
        cta: "Upcoming Events",
        href: "/#events",
        image: heroImages[1],
        video: heroVideos[1],
        position: "center center",
      },
      {
        eyebrow: "Visit • Worship • Connect",
        title: "Worship and Church Family Life",
        mobileTitle: "Worship and Church Family Life",
        highlightWords: ["Worship", "Church Family"],
        subtitle:
          "Explore ministries, events, and meaningful ways to connect, serve, and grow together in Christ.",
        mobileSubtitle:
          "Explore ministries, events, and meaningful ways to connect, serve, and grow together in Christ.",
        cta: "Watch Sermons",
        href: "/#sermons",
        image: heroImages[2],
        video: heroVideos[2],
        position: "center center",
      },
    ];

    if (!fromI18n.length) return defaultSlides;

    return fromI18n.map((slide, index) => ({
      ...slide,
      image: heroImages[index] || heroImages[0],
      video: heroVideos[index] || null,
      eyebrow: slide.eyebrow || slide.badge || "Debre-Genet Holy Trinity",
      position: slide.position || "center center",
      highlightWords: slide.highlightWords || [],
      mobileTitle: slide.mobileTitle || slide.title,
      mobileSubtitle: slide.mobileSubtitle || slide.subtitle,
    }));
  }, [t]);

  const [active, setActive] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 760;
  });

  const videoRefs = useRef([]);

  const total = slides.length;
  const activeSlide = slides[active] || slides[0];

  const goTo = (index) => setActive((index + total) % total);
  const goNext = () => setActive((prev) => (prev + 1) % total);
  const goPrev = () => setActive((prev) => (prev - 1 + total) % total);

  useEffect(() => {
    if (total <= 1) return;

    const activeVideo = videoRefs.current[active];
    let timerId = null;
    let endedHandler = null;
    let loadedMetadataHandler = null;

    if (activeSlide?.video && activeVideo) {
      endedHandler = () => {
        setActive((prev) => (prev + 1) % total);
      };

      activeVideo.addEventListener("ended", endedHandler);

      const setupFallback = () => {
        if (!Number.isFinite(activeVideo.duration) || activeVideo.duration <= 0) {
          timerId = window.setTimeout(() => {
            setActive((prev) => (prev + 1) % total);
          }, IMAGE_SLIDE_DURATION);
        }
      };

      if (activeVideo.readyState >= 1) {
        setupFallback();
      } else {
        loadedMetadataHandler = () => {
          setupFallback();
        };
        activeVideo.addEventListener("loadedmetadata", loadedMetadataHandler);
      }
    } else {
      timerId = window.setTimeout(() => {
        setActive((prev) => (prev + 1) % total);
      }, IMAGE_SLIDE_DURATION);
    }

    return () => {
      if (timerId) {
        window.clearTimeout(timerId);
      }

      if (activeVideo && endedHandler) {
        activeVideo.removeEventListener("ended", endedHandler);
      }

      if (activeVideo && loadedMetadataHandler) {
        activeVideo.removeEventListener("loadedmetadata", loadedMetadataHandler);
      }
    };
  }, [active, activeSlide, total]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 760);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((videoEl, index) => {
      if (!videoEl) return;

      if (index === active) {
        try {
          videoEl.currentTime = 0;
        } catch {
          // ignore
        }

        const playPromise = videoEl.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      } else {
        videoEl.pause();
        try {
          videoEl.currentTime = 0;
        } catch {
          // ignore
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

  const currentTitle =
    isMobile && activeSlide?.mobileTitle
      ? activeSlide.mobileTitle
      : activeSlide?.title;

  const currentSubtitle =
    isMobile && activeSlide?.mobileSubtitle
      ? activeSlide.mobileSubtitle
      : activeSlide?.subtitle;

  const renderTitle = (title, highlightWords = []) => {
    if (!title) return null;
    if (!highlightWords.length) return title;

    let processed = title;

    highlightWords.forEach((word) => {
      const safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      processed = processed.replace(
        new RegExp(safeWord, "gi"),
        `|||HIGHLIGHT_START|||$&|||HIGHLIGHT_END|||`
      );
    });

    const parts = processed.split("|||");

    return parts.map((part, index) => {
      if (part === "HIGHLIGHT_START" || part === "HIGHLIGHT_END") return null;

      const prev = parts[index - 1];
      const next = parts[index + 1];

      if (prev === "HIGHLIGHT_START" && next === "HIGHLIGHT_END") {
        return (
          <span key={`${part}-${index}`} className="heroText__titleAccent">
            {part}
          </span>
        );
      }

      return <span key={`${part}-${index}`}>{part}</span>;
    });
  };

  return (
    <section
      className="hero"
      id="home"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Church hero section"
    >
      <div className="hero__ambient hero__ambient--one" aria-hidden="true" />
      <div className="hero__ambient hero__ambient--two" aria-hidden="true" />

      <div className="hero__shell">
        <div className="hero__layout">
          <div className="hero__media">
            <div className="hero__mediaStage">
              <div className="hero__mediaGlow" aria-hidden="true" />
              <div className="hero__mediaShine" aria-hidden="true" />
              <div className="hero__mediaOverlay" aria-hidden="true" />

              <div className="hero__slides">
                {slides.map((slide, index) => {
                  const isActive = index === active;

                  return (
                    <div
                      key={`${slide.title}-${index}`}
                      className={`hero__slide ${isActive ? "is-active" : ""}`}
                      aria-hidden={!isActive}
                    >
                      {slide.video ? (
                        <video
                          ref={(el) => {
                            videoRefs.current[index] = el;
                          }}
                          className="hero__video"
                          muted
                          playsInline
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

              <div className="hero__overlayContent">
                <div className="heroText heroText--overlay">
                  <div className="heroText__eyebrow amharic-fix">
                    {activeSlide?.eyebrow}
                  </div>

                  <h1 className="heroText__title amharic-fix">
                    {renderTitle(currentTitle, activeSlide?.highlightWords)}
                  </h1>

                  <p className="heroText__subtitle amharic-fix">
                    {currentSubtitle}
                  </p>

                  <div className="heroText__actions">
                    <Link to={primaryTo} className="heroBtn heroBtn--primary">
                      {activeSlide?.cta}
                      <span aria-hidden="true">→</span>
                    </Link>

                    <Link to={secondaryTo} className="heroBtn heroBtn--ghost">
                      {t.hero?.btnSecondary || "Plan Your Visit"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      </div>
    </section>
  );
}

export default Hero;
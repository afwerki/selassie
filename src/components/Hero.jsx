import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";

import slide1 from "../assets/images/Kids.JPG";
import slide2 from "../assets/images/church7.JPG";
import slide3 from "../assets/images/church9.JPG";

import heroVideo1 from "../assets/videos/modified_1.MP4";
import heroVideo2 from "../assets/videos/kids.mp4";
import heroVideo3 from "../assets/videos/church_inside2.MP4";

const heroImages = [slide1, slide2, slide3];
const heroVideos = [heroVideo1, heroVideo2, heroVideo3];

const IMAGE_SLIDE_DURATION = 7000;
const VIDEO_FALLBACK_DURATION = 9000;
const MOBILE_BREAKPOINT = 760;

function getVideoType(src) {
  const lower = String(src || "").toLowerCase();

  if (lower.endsWith(".webm")) return "video/webm";
  if (lower.endsWith(".mov")) return "video/quicktime";

  return "video/mp4";
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitTitleWords(title, highlightWords = []) {
  if (!title) return [];

  const highlights = highlightWords
    .filter(Boolean)
    .map((word) => escapeRegExp(word))
    .join("|");

  if (!highlights) {
    return title.split(/(\s+)/).map((part) => ({
      text: part,
      isSpace: /^\s+$/.test(part),
      isAccent: false,
    }));
  }

  const regex = new RegExp(`(${highlights})`, "gi");
  const parts = title.split(regex).filter(Boolean);

  return parts.flatMap((part) => {
    const isAccent = highlightWords.some(
      (word) => word.toLowerCase() === part.toLowerCase()
    );

    if (isAccent) {
      return [
        {
          text: part,
          isSpace: false,
          isAccent: true,
        },
      ];
    }

    return part.split(/(\s+)/).map((wordPart) => ({
      text: wordPart,
      isSpace: /^\s+$/.test(wordPart),
      isAccent: false,
    }));
  });
}

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
        cta: "Meet Our Clergy",
        href: "/#clergy",
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
  const [textAnimationKey, setTextAnimationKey] = useState(0);
  const [videoReady, setVideoReady] = useState({});
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= MOBILE_BREAKPOINT;
  });

  const videoRefs = useRef([]);

  const total = slides.length;
  const activeSlide = slides[active] || slides[0];

  const goTo = (index) => {
    if (!total) return;
    setActive((index + total) % total);
  };

  const goNext = () => {
    if (!total) return;
    setActive((prev) => (prev + 1) % total);
  };

  const goPrev = () => {
    if (!total) return;
    setActive((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (active >= total) {
      setActive(0);
    }
  }, [active, total]);

  useEffect(() => {
    setTextAnimationKey((prev) => prev + 1);
  }, [active, lang]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (total <= 1) return;

    const activeVideo = videoRefs.current[active];
    let timerId = null;
    let endedHandler = null;
    let errorHandler = null;

    const moveNext = () => {
      setActive((prev) => (prev + 1) % total);
    };

    if (activeSlide?.video && activeVideo) {
      endedHandler = moveNext;
      errorHandler = () => {
        timerId = window.setTimeout(moveNext, IMAGE_SLIDE_DURATION);
      };

      activeVideo.addEventListener("ended", endedHandler);
      activeVideo.addEventListener("error", errorHandler);

      timerId = window.setTimeout(moveNext, VIDEO_FALLBACK_DURATION);
    } else {
      timerId = window.setTimeout(moveNext, IMAGE_SLIDE_DURATION);
    }

    return () => {
      if (timerId) window.clearTimeout(timerId);

      if (activeVideo && endedHandler) {
        activeVideo.removeEventListener("ended", endedHandler);
      }

      if (activeVideo && errorHandler) {
        activeVideo.removeEventListener("error", errorHandler);
      }
    };
  }, [active, activeSlide, total]);

  useEffect(() => {
    videoRefs.current.forEach((videoEl, index) => {
      if (!videoEl) return;

      if (index === active) {
        videoEl.muted = true;
        videoEl.playsInline = true;

        try {
          videoEl.currentTime = 0;
        } catch {
          // Ignore browser seek issues.
        }

        const playPromise = videoEl.play();

        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {
            window.setTimeout(() => {
              videoEl.play().catch(() => {});
            }, 250);
          });
        }
      } else {
        // Keep decoded/buffered frames available for the next transition.
        videoEl.pause();
      }
    });
  }, [active, slides, lang]);

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

  const titleParts = splitTitleWords(
    currentTitle,
    activeSlide?.highlightWords || []
  );

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
                      key={`${slide.title || "slide"}-${index}`}
                      className={`hero__slide ${isActive ? "is-active" : ""}`}
                      aria-hidden={!isActive}
                    >
                      <div
                        className="hero__imageFallback"
                        style={{
                          backgroundImage: `url(${slide.image})`,
                          backgroundPosition:
                            slide.position || "center center",
                        }}
                        aria-hidden="true"
                      />

                      {slide.video && (
                        <video
                          ref={(el) => {
                            videoRefs.current[index] = el;
                          }}
                          className={`hero__video ${
                            videoReady[index] ? "is-ready" : ""
                          }`}
                          muted
                          playsInline
                          preload="auto"
                          poster={slide.image}
                          style={{
                            objectPosition: slide.position || "center center",
                          }}
                          onLoadedData={(e) => {
                            setVideoReady((prev) =>
                              prev[index]
                                ? prev
                                : { ...prev, [index]: true }
                            );

                            if (isActive) {
                              e.currentTarget.play().catch(() => {});
                            }
                          }}
                          onCanPlay={(e) => {
                            setVideoReady((prev) =>
                              prev[index]
                                ? prev
                                : { ...prev, [index]: true }
                            );

                            if (isActive) {
                              e.currentTarget.play().catch(() => {});
                            }
                          }}
                        >
                          <source
                            src={slide.video}
                            type={getVideoType(slide.video)}
                          />
                        </video>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="hero__overlayContent">
                <div
                  key={textAnimationKey}
                  className="heroText heroText--overlay"
                >
                  <div className="heroText__eyebrow amharic-fix">
                    <span className="heroText__eyebrowIcon" aria-hidden="true">
                      ✣
                    </span>
                    <span>{activeSlide?.eyebrow}</span>
                  </div>

                  <h1 className="heroText__title amharic-fix">
                    {titleParts.map((part, index) => {
                      if (part.isSpace) {
                        return ` `;
                      }

                      return (
                        <span
                          key={`${part.text}-${index}`}
                          className={
                            part.isAccent
                              ? "heroText__word heroText__titleAccent"
                              : "heroText__word"
                          }
                          style={{ "--word-index": index }}
                        >
                          {part.text}
                        </span>
                      );
                    })}
                  </h1>

                  <p className="heroText__subtitle amharic-fix">
                    {currentSubtitle}
                  </p>

                  <div className="heroText__actions">
                    <Link to={primaryTo} className="heroBtn heroBtn--primary">
                      <span>{activeSlide?.cta}</span>
                      <span className="heroBtn__arrow" aria-hidden="true">
                        →
                      </span>
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
            {slides.map((slide, index) => (
              <button
                key={index}
                type="button"
                className={`heroDot ${index === active ? "is-active" : ""}`}
                onClick={() => goTo(index)}
                aria-label={`Go to ${slide.title || `slide ${index + 1}`}`}
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
import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styling/projects.css";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";
import { projectTexts } from "../i18n/projectTexts";

function Projects() {
  const { lang } = useLanguage();
  const t = texts[lang] || texts.en;

  const pageText = t.projects || {};
  const pageTitle =
    pageText.pageTitle || (lang === "am" ? "ፕሮጀክቶች" : "Parish Projects");
  const pageIntro =
    pageText.pageIntro ||
    (lang === "am"
      ? "እዚህ የቤተ ክርስቲያኑ ዋና ፕሮጀክቶች እና ተከታታይ ሥራዎች ይታያሉ።"
      : "Explore some of the key projects we are working on as a parish – from community outreach and youth initiatives to church renovation and digital ministry.");

  const langProjects =
    projectTexts?.[lang] && Object.keys(projectTexts[lang]).length > 0
      ? projectTexts[lang]
      : projectTexts?.en || {};

  const allProjects = useMemo(() => {
    const entries = Object.entries(langProjects || {});
    return entries.map(([key, p], idx) => ({
      __key: key,
      id: p.id || key,
      title: p.title,
      miniTitle: p.miniTitle,
      status: p.status || "planned",
      startDate: p.startDate,
      shortDescription: p.shortDescription,
      longDescription: p.longDescription,
      heroImageUrl: p.heroImageUrl,
      heroImageAlt: p.heroImageAlt,
      cta: p.cta,
      supportTitle: p.supportTitle,
      supportItems: p.supportItems,
      instagram: p.instagram,
      carouselImages: p.carouselImages,
      _index: idx,
    }));
  }, [langProjects]);

  const featuredProject = useMemo(() => {
    return (
      allProjects.find(
        (p) =>
          p.id === "church_restoration_appeal" ||
          p.__key === "church_restoration_appeal" ||
          p.title?.toLowerCase().includes("restoration")
      ) || allProjects[0] || null
    );
  }, [allProjects]);

  const secondaryProjects = useMemo(() => {
    if (!featuredProject) return [];
    return allProjects.filter((p) => p.__key !== featuredProject.__key);
  }, [allProjects, featuredProject]);

  const [expandedMap, setExpandedMap] = useState({});
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lightbox, setLightbox] = useState({
    open: false,
    images: [],
    index: 0,
    title: "",
  });

  const projectRefs = useRef({});

  useEffect(() => {
    setExpandedMap({});
    setShowAllProjects(false);
    setLightbox({
      open: false,
      images: [],
      index: 0,
      title: "",
    });
  }, [lang]);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY || 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.open) return;

      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        nextLightboxImage();
      } else if (e.key === "ArrowLeft") {
        prevLightboxImage();
      }
    };

    if (lightbox.open) {
      document.body.classList.add("project-modal-open");
    } else {
      document.body.classList.remove("project-modal-open");
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("project-modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightbox.open]);

  const toggleProject = (key) => {
    const isCurrentlyExpanded = !!expandedMap[key];

    if (!isCurrentlyExpanded) {
      setExpandedMap((prev) => ({
        ...prev,
        [key]: true,
      }));
      return;
    }

    setExpandedMap((prev) => ({
      ...prev,
      [key]: false,
    }));

    const targetEl = projectRefs.current[key];
    if (targetEl) {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const headerOffset = 120;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: y,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  };

  const toggleShowAllProjects = () => {
    setShowAllProjects((prev) => !prev);
  };

  const onOpen = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getStatusLabel = (status) => {
    const s = status || "planned";
    if (s === "completed") return lang === "am" ? "ተጠናቀቀ" : "Completed";
    if (s === "in_progress") return lang === "am" ? "በሂደት ላይ" : "In progress";
    if (s === "ongoing") return lang === "am" ? "ቀጣይ" : "Ongoing";
    return lang === "am" ? "የሚጀምር" : "Planned";
  };

  const parseInline = (text) => {
    if (!text) return null;

    const urlRegex = /(https?:\/\/[^\s)]+)|(www\.[^\s)]+)/g;
    const parts = text.split(urlRegex).filter((p) => p !== undefined);

    return parts.map((part, idx) => {
      if (!part) return null;

      const isUrl = /^https?:\/\//.test(part) || /^www\./.test(part);
      if (isUrl) {
        const href = part.startsWith("http") ? part : `https://${part}`;
        return (
          <a key={idx} href={href} target="_blank" rel="noreferrer">
            {part}
          </a>
        );
      }

      const boldRegex = /\*\*(.+?)\*\*/g;
      const segs = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(part)) !== null) {
        const start = match.index;
        const end = boldRegex.lastIndex;
        if (start > lastIndex) segs.push(part.slice(lastIndex, start));
        segs.push(<strong key={`${idx}-b-${start}`}>{match[1]}</strong>);
        lastIndex = end;
      }

      if (lastIndex < part.length) segs.push(part.slice(lastIndex));
      return <React.Fragment key={idx}>{segs}</React.Fragment>;
    });
  };

  const renderFormattedText = (body) => {
    if (!body) return null;

    const lines = body.split("\n");
    const blocks = [];
    let buf = [];

    const flush = () => {
      if (buf.length) {
        blocks.push(buf);
        buf = [];
      }
    };

    for (const line of lines) {
      if (line.trim() === "") flush();
      else buf.push(line);
    }
    flush();

    return blocks.map((block, i) => {
      const first = block[0].trim();

      if (/^---+$/.test(first)) {
        return <hr key={`hr-${i}`} className="project-divider" />;
      }

      if (first.startsWith("### ")) {
        return (
          <h3 key={`h3-${i}`} className="project-h3">
            {parseInline(first.replace(/^###\s+/, ""))}
          </h3>
        );
      }

      if (first.startsWith("## ")) {
        return (
          <h2 key={`h2-${i}`} className="project-h2">
            {parseInline(first.replace(/^##\s+/, ""))}
          </h2>
        );
      }

      const isUl = block.every((l) => l.trim().startsWith("- "));
      if (isUl) {
        return (
          <ul key={`ul-${i}`} className="project-ul">
            {block.map((l, idx) => (
              <li key={`uli-${i}-${idx}`}>{parseInline(l.trim().slice(2))}</li>
            ))}
          </ul>
        );
      }

      const isOl = block.every((l) => /^\d+\.\s+/.test(l.trim()));
      if (isOl) {
        return (
          <ol key={`ol-${i}`} className="project-ol">
            {block.map((l, idx) => (
              <li key={`oli-${i}-${idx}`}>
                {parseInline(l.trim().replace(/^\d+\.\s+/, ""))}
              </li>
            ))}
          </ol>
        );
      }

      return (
        <div key={`p-${i}`}>
          {block.map((l, idx) => (
            <p key={`pp-${i}-${idx}`} className="project-p">
              {parseInline(l)}
            </p>
          ))}
        </div>
      );
    });
  };

  const openLightbox = (images = [], startIndex = 0, title = "") => {
    const safeImages = (images || []).filter(Boolean);
    if (!safeImages.length) return;

    setLightbox({
      open: true,
      images: safeImages,
      index: Math.max(0, Math.min(startIndex, safeImages.length - 1)),
      title,
    });
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const nextLightboxImage = () => {
    setLightbox((prev) => {
      if (!prev.images.length) return prev;
      return {
        ...prev,
        index: (prev.index + 1) % prev.images.length,
      };
    });
  };

  const prevLightboxImage = () => {
    setLightbox((prev) => {
      if (!prev.images.length) return prev;
      return {
        ...prev,
        index: (prev.index - 1 + prev.images.length) % prev.images.length,
      };
    });
  };

  const MovingCarousel = ({ images = [], speed = 26, variant = "card", title = "" }) => {
    const safe = (images || []).filter(Boolean);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
    const [activeIndex, setActiveIndex] = useState(0);
    const mobileTrackRef = useRef(null);

    useEffect(() => {
      const onResize = () => setIsMobile(window.innerWidth <= 768);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
      if (!isMobile || safe.length <= 1) return;

      const interval = setInterval(() => {
        setActiveIndex((prev) => {
          const next = (prev + 1) % safe.length;

          if (mobileTrackRef.current) {
            const slideWidth = mobileTrackRef.current.clientWidth;
            mobileTrackRef.current.scrollTo({
              left: slideWidth * next,
              behavior: "smooth",
            });
          }

          return next;
        });
      }, 3200);

      return () => clearInterval(interval);
    }, [isMobile, safe.length]);

    const handleMobileScroll = () => {
      if (!mobileTrackRef.current) return;
      const { scrollLeft, clientWidth } = mobileTrackRef.current;
      const nextIndex = Math.round(scrollLeft / clientWidth);
      setActiveIndex(nextIndex);
    };

    if (!safe.length) return null;

    if (isMobile) {
      return (
        <div
          className={`project-carousel project-carousel--mobile project-carousel--${variant}`}
          aria-label={`${title || "Project"} image carousel`}
        >
          <div
            className="project-carousel__mobile-track"
            ref={mobileTrackRef}
            onScroll={handleMobileScroll}
          >
            {safe.map((src, idx) => (
              <div className="project-carousel__mobile-slide" key={`${src}-${idx}`}>
                <button
                  type="button"
                  className="project-carousel__zoom-btn project-carousel__zoom-btn--mobile"
                  onClick={() => openLightbox(safe, idx, title)}
                  aria-label={`Open image ${idx + 1} for ${title || "project"}`}
                >
                  <img src={src} alt="" loading="lazy" draggable="false" />
                </button>
              </div>
            ))}
          </div>

          {safe.length > 1 && (
            <div className="project-carousel__dots" aria-hidden="true">
              {safe.map((_, idx) => (
                <span
                  key={idx}
                  className={`project-carousel__dot ${idx === activeIndex ? "is-active" : ""}`}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    const track = [...safe, ...safe];

    return (
      <div
        className={`project-carousel project-carousel--desktop project-carousel--${variant}`}
        style={{ "--duration": `${Math.max(12, speed)}s` }}
        aria-label={`${title || "Project"} image carousel`}
      >
        <div className="project-carousel__fade project-carousel__fade--left" aria-hidden="true" />
        <div className="project-carousel__fade project-carousel__fade--right" aria-hidden="true" />

        <div className="project-carousel__viewport">
          <div className="project-carousel__track">
            {track.map((src, idx) => {
              const realIndex = idx % safe.length;
              return (
                <div className="project-carousel__item" key={`${src}-${idx}`}>
                  <button
                    type="button"
                    className="project-carousel__zoom-btn"
                    onClick={() => openLightbox(safe, realIndex, title)}
                    aria-label={`Open image ${realIndex + 1} for ${title || "project"}`}
                  >
                    <img src={src} alt="" loading="lazy" draggable="false" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const hasCarousel = (project) =>
    Array.isArray(project?.carouselImages) && project.carouselImages.length > 0;

  const renderProjectContent = (project, featured = false) => {
    const isExpanded = !!expandedMap[project.__key];
    const hasLong = !!project.longDescription;

    return (
      <>
        <div className="project-meta-top">
          <div className="project-meta-top__left">
            {featured && (
              <div className="project-featured-badge">
                {lang === "am" ? "ዋና የፓሪሽ ፕሮጀክት" : "Main Parish Project"}
              </div>
            )}

            <span className={`project-status-pill project-status-pill--${project.status || "planned"}`}>
              {getStatusLabel(project.status)}
            </span>
          </div>

          {project.startDate && (
            <span className="project-date">{formatDate(project.startDate)}</span>
          )}
        </div>

        <h3 className="project-title">{project.title}</h3>

        {!!project.miniTitle && (
          <p className="project-miniTitle">{project.miniTitle}</p>
        )}

        <p className="project-description">
          {project.shortDescription ||
            (lang === "am"
              ? "ስለዚህ ፕሮጀክት ተጨማሪ መረጃ በቅርቡ ይጨመራል።"
              : "Details for this project will be added soon.")}
        </p>

        {!featured && (
          <div className={`project-inline-expand ${isExpanded ? "project-inline-expand--open" : ""}`}>
            <div className="project-inline-expand__content">
              {hasLong && renderFormattedText(project.longDescription)}

              {(project.supportTitle || project.supportItems?.length > 0) && (
                <div className="project-supportBox project-supportBox--inline">
                  <p className="project-supportBox__title">
                    {project.supportTitle ||
                      (lang === "am"
                        ? "እንዴት ልትረዱ ትችላላችሁ?"
                        : "How you can support")}
                  </p>

                  {project.supportItems?.length > 0 && (
                    <ul className="project-supportBox__list">
                      {project.supportItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`project-card-actions ${featured ? "project-card-actions--featured" : ""}`}>
          {hasLong && (
            <button
              type="button"
              className="project-read-more-btn"
              onClick={() => toggleProject(project.__key)}
              aria-expanded={isExpanded}
            >
              {isExpanded
                ? lang === "am"
                  ? "ዝርዝር ዝጋ"
                  : "Show less"
                : lang === "am"
                ? "ተጨማሪ ያንብቡ"
                : "Read more"}
            </button>
          )}

          {project.instagram?.url && (
            <button
              type="button"
              className={featured ? "project-secondary-cta-btn" : "project-outline-cta-btn"}
              onClick={() => onOpen(project.instagram.url)}
            >
              {project.instagram.label || (lang === "am" ? "ኢንስታግራም" : "Instagram")}
            </button>
          )}

          {!project.instagram?.url && project.cta?.url && (
            <button
              type="button"
              className={featured ? "project-secondary-cta-btn" : "project-outline-cta-btn"}
              onClick={() => onOpen(project.cta.url)}
            >
              {project.cta.label || (lang === "am" ? "ይለግሱ" : "Contribute")}
            </button>
          )}
        </div>
      </>
    );
  };

  const renderProjectCard = (project, featured = false) => {
    const isExpanded = !!expandedMap[project.__key];
    const parallaxOffset = featured ? Math.max(-18, Math.min(18, scrollY * -0.03)) : 0;
    const bodyOffset = featured ? Math.max(-10, Math.min(10, scrollY * -0.012)) : 0;
    const galleryImages = hasCarousel(project)
      ? project.carouselImages
      : project.heroImageUrl
      ? [project.heroImageUrl]
      : [];

    return (
      <article
        key={project.__key}
        ref={(el) => {
          if (el) projectRefs.current[project.__key] = el;
        }}
        className={[
          "project-card",
          featured ? "project-card--featured" : "project-card--standard",
          isExpanded ? "project-card--active" : "",
          featured && isExpanded ? "project-card--featured-expanded" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={`project-image-shell ${featured ? "project-image-shell--featured" : "project-image-shell--standard"}`}
        >
          <div
            className={`project-image-wrapper ${featured ? "project-image-wrapper--featured" : "project-image-wrapper--standard"}`}
            style={featured ? { transform: `translateY(${parallaxOffset}px)` } : undefined}
          >
            {hasCarousel(project) ? (
              <MovingCarousel
                images={project.carouselImages}
                speed={featured ? 28 : 24}
                variant={featured ? "featured" : "card"}
                title={project.title}
              />
            ) : project.heroImageUrl ? (
              <button
                type="button"
                className="project-image-open-btn"
                onClick={() => openLightbox(galleryImages, 0, project.title)}
                aria-label={`Open image for ${project.title}`}
              >
                <img
                  src={project.heroImageUrl}
                  alt={project.heroImageAlt || project.title}
                  className="project-image"
                  loading="lazy"
                />
                <div className="project-image-overlay" />
              </button>
            ) : (
              <>
                <div className="project-image project-image--placeholder" aria-hidden="true" />
                <div className="project-image-overlay" />
              </>
            )}
          </div>
        </div>

        <div
          className={`project-body ${featured ? "project-body--featured" : "project-body--standard"}`}
          style={featured ? { transform: `translateY(${bodyOffset}px)` } : undefined}
        >
          {renderProjectContent(project, featured)}
        </div>

        {featured && (
          <div className={`project-featured-expand ${isExpanded ? "project-featured-expand--open" : ""}`}>
            <div className="project-featured-expand__inner">
              {project.longDescription && renderFormattedText(project.longDescription)}

              {(project.supportTitle || project.supportItems?.length > 0) && (
                <div className="project-supportBox project-supportBox--inline">
                  <p className="project-supportBox__title">
                    {project.supportTitle ||
                      (lang === "am"
                        ? "እንዴት ልትረዱ ትችላላችሁ?"
                        : "How you can support")}
                  </p>

                  {project.supportItems?.length > 0 && (
                    <ul className="project-supportBox__list">
                      {project.supportItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </article>
    );
  };

  return (
    <>
      <main className="page page--projects" id="projects">
        <section className="section-header projects-page-header">
          <h2>{pageTitle}</h2>
          <p>{pageIntro}</p>
        </section>

        <section className="projects-section">
          {allProjects.length === 0 && (
            <p className="projects-empty">
              {lang === "am"
                ? "ፕሮጀክቶች በቅርቡ ይጨመራሉ።"
                : "Projects will appear here once they are published."}
            </p>
          )}

          {featuredProject && (
            <section className="projects-featured">
              {renderProjectCard(featuredProject, true)}
            </section>
          )}

          {secondaryProjects.length > 0 && (
            <section className="projects-lower">
              <div className="projects-lower__header">
                <h3>{lang === "am" ? "ሌሎች የፓሪሽ ፕሮጀክቶች" : "Other Parish Projects"}</h3>
                <p>
                  {lang === "am"
                    ? "ከዋናው የማስተካከያ ፕሮጀክት በተጨማሪ እነዚህም በፓሪሹ ውስጥ በንቃት ላይ ያሉ አገልግሎቶች ናቸው።"
                    : "Alongside the restoration appeal, these are some of the other active projects serving the parish and wider community."}
                </p>
              </div>

              <div className={`projects-grid ${showAllProjects ? "projects-grid--expanded" : ""}`}>
                {secondaryProjects.map((project) => renderProjectCard(project, false))}
              </div>

              {secondaryProjects.length > 2 && (
                <div className="projects-more-wrapper">
                  <button
                    type="button"
                    className="projects-more-btn"
                    onClick={toggleShowAllProjects}
                  >
                    {showAllProjects
                      ? lang === "am"
                        ? "ያጣሩ"
                        : "Show fewer projects"
                      : lang === "am"
                      ? "ተጨማሪ ፕሮጀክቶች ይመልከቱ"
                      : "Show more projects"}
                  </button>
                </div>
              )}
            </section>
          )}
        </section>
      </main>

      {lightbox.open && (
        <div
          className="project-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title || "Image viewer"}
        >
          <button
            type="button"
            className="project-lightbox__backdrop"
            onClick={closeLightbox}
            aria-label={lang === "am" ? "ዝጋ" : "Close image viewer"}
          />

          <div className="project-lightbox__dialog">
            <button
              type="button"
              className="project-lightbox__close"
              onClick={closeLightbox}
              aria-label={lang === "am" ? "ዝጋ" : "Close"}
            >
              ×
            </button>

            {lightbox.images.length > 1 && (
              <button
                type="button"
                className="project-lightbox__nav project-lightbox__nav--prev"
                onClick={prevLightboxImage}
                aria-label={lang === "am" ? "የቀድሞ ፎቶ" : "Previous image"}
              >
                ‹
              </button>
            )}

            <div className="project-lightbox__content">
              <img
                src={lightbox.images[lightbox.index]}
                alt={lightbox.title || "Project image"}
                className="project-lightbox__image"
              />
              {lightbox.title && (
                <p className="project-lightbox__caption">{lightbox.title}</p>
              )}
            </div>

            {lightbox.images.length > 1 && (
              <button
                type="button"
                className="project-lightbox__nav project-lightbox__nav--next"
                onClick={nextLightboxImage}
                aria-label={lang === "am" ? "ቀጣይ ፎቶ" : "Next image"}
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Projects;
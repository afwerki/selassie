import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styling/projects.css";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";
import { projectTexts } from "../i18n/projectTexts";

function Projects() {
  const { lang } = useLanguage();
  const t = texts[lang] || texts.en;

  const pageText = t.projects || {};
  const pageTitle = pageText.pageTitle || (lang === "am" ? "ፕሮጀክቶች" : "Projects");
  const pageIntro =
    pageText.pageIntro ||
    (lang === "am"
      ? "እዚህ የቤተ ክርስቲያኑ ፕሮጀክቶች እና ተከታታይ ሥራዎች ይታያሉ።"
      : "Explore some of the key projects we are working on as a parish – from community outreach and youth initiatives to church renovation and digital ministry.");

  // ✅ Always pull projects from projectTexts, fallback to en if missing
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
      mediaHints: p.mediaHints,
      instagram: p.instagram,
      carouselImages: p.carouselImages,
      _index: idx,
    }));
  }, [langProjects]);

  const [expandedKey, setExpandedKey] = useState(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const expandedRef = useRef(null);

  useEffect(() => {
    setExpandedKey(null);
    setShowAllProjects(false);
  }, [lang]);

  const expandedProject = useMemo(() => {
    if (!expandedKey) return null;
    return allProjects.find((p) => p.__key === expandedKey) || null;
  }, [expandedKey, allProjects]);

  useEffect(() => {
    if (expandedProject && expandedRef.current) {
      expandedRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [expandedProject]);

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
    if (s === "in_progress") return lang === "am" ? "በመካከለኛ ሂደት" : "In progress";
    if (s === "ongoing") return lang === "am" ? "በሂደት ላይ ያለ" : "Ongoing";
    return lang === "am" ? "የሚጀምር" : "Planned";
  };

  const toggleProject = (key) => setExpandedKey((cur) => (cur === key ? null : key));
  const toggleShowAllProjects = () => setShowAllProjects((p) => !p);

  const onOpen = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* ============================================================
     Lightweight Markdown-like renderer (no deps)
  ============================================================ */
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

  const renderFormattedText = (intro, body) => {
    const raw = [intro, body].filter(Boolean).join("\n\n");
    const lines = raw.split("\n");

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

    const nodes = [];

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const first = block[0].trim();

      if (/^---+$/.test(first)) {
        nodes.push(<hr key={`hr-${i}`} className="project-divider" />);
        continue;
      }

      if (first.startsWith("### ")) {
        nodes.push(
          <h3 key={`h3-${i}`} className="project-h3">
            {parseInline(first.replace(/^###\s+/, ""))}
          </h3>
        );
        continue;
      }
      if (first.startsWith("## ")) {
        nodes.push(
          <h2 key={`h2-${i}`} className="project-h2">
            {parseInline(first.replace(/^##\s+/, ""))}
          </h2>
        );
        continue;
      }

      const isUl = block.every((l) => l.trim().startsWith("- "));
      if (isUl) {
        nodes.push(
          <ul key={`ul-${i}`} className="project-ul">
            {block.map((l, idx) => (
              <li key={`uli-${i}-${idx}`}>{parseInline(l.trim().slice(2))}</li>
            ))}
          </ul>
        );
        continue;
      }

      const isOl = block.every((l) => /^\d+\.\s+/.test(l.trim()));
      if (isOl) {
        nodes.push(
          <ol key={`ol-${i}`} className="project-ol">
            {block.map((l, idx) => (
              <li key={`oli-${i}-${idx}`}>{parseInline(l.trim().replace(/^\d+\.\s+/, ""))}</li>
            ))}
          </ol>
        );
        continue;
      }

      nodes.push(
        <div key={`p-${i}`}>
          {block.map((l, idx) => (
            <p key={`pp-${i}-${idx}`} className="project-p">
              {parseInline(l)}
            </p>
          ))}
        </div>
      );
    }

    return nodes;
  };

  // ✅ Instagram icon
  const InstagramIcon = ({ className = "" }) => (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16.8 3H7.2A4.2 4.2 0 0 0 3 7.2v9.6A4.2 4.2 0 0 0 7.2 21h9.6a4.2 4.2 0 0 0 4.2-4.2V7.2A4.2 4.2 0 0 0 16.8 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 16.2A4.2 4.2 0 1 0 12 7.8a4.2 4.2 0 0 0 0 8.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M17.4 6.6h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );

  // ✅ Premium infinite carousel
  const MovingCarousel = ({ images = [], speed = 26, variant = "card" }) => {
    const safe = (images || []).filter(Boolean);
    if (safe.length === 0) return null;

    const track = [...safe, ...safe];

    return (
      <div
        className={`project-carousel project-carousel--${variant}`}
        style={{ ["--duration"]: `${Math.max(10, speed)}s` }}
        aria-label="Project photos carousel"
      >
        <div className="project-carousel__fade project-carousel__fade--left" aria-hidden="true" />
        <div className="project-carousel__fade project-carousel__fade--right" aria-hidden="true" />

        <div className="project-carousel__viewport">
          <div className="project-carousel__track">
            {track.map((src, idx) => (
              <div className="project-carousel__item" key={`${src}-${idx}`}>
                <img src={src} alt="" loading="lazy" draggable="false" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const isYouth = (p) => p?.id === "youth_education";
  const youthInstaUrl = expandedProject?.instagram?.url;

  // ✅ Remove top Instagram button in AMHARIC (you said it duplicates)
  const showTopInstagramInExpanded = (p) => isYouth(p) && lang !== "am" && !!p?.instagram?.url;

  // ✅ Decide hero display: if carouselImages exist, use carousel instead of big hero image
  const hasCarousel = (p) => Array.isArray(p?.carouselImages) && p.carouselImages.length > 0;

  return (
    <main className="page" id="projects">
      <section className="section-header projects-page-header">
        <h2>{pageTitle}</h2>
        <p>{pageIntro}</p>
      </section>

      <section className="projects-section">
        {allProjects.length === 0 && (
          <p className="projects-empty">
            {lang === "am" ? "ፕሮጀክቶች በቅርቡ ይጨመራሉ።" : "Projects will appear here once they are published."}
          </p>
        )}

        {allProjects.length > 0 && (
          <>
            {/* EXPANDED PANEL */}
            {expandedProject && (
              <section className="project-expanded" ref={expandedRef} aria-label="Project details">
                <div className="project-expanded__inner">
                  <div className="project-expanded__header">
                    <div className="project-expanded__meta">
                      <span className={`project-status-pill project-status-pill--${expandedProject.status || "planned"}`}>
                        {getStatusLabel(expandedProject.status)}
                      </span>

                      {expandedProject.startDate && <span className="project-date">{formatDate(expandedProject.startDate)}</span>}
                    </div>

                    <button
                      type="button"
                      className="project-expanded__close"
                      onClick={() => setExpandedKey(null)}
                      aria-label={lang === "am" ? "ዝጋ" : "Close"}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="project-expanded__content">
                    {/* LEFT */}
                    <aside className="project-expanded__left">
                      <div className="project-heroCard">
                        <h3 className="project-heroTitle">{expandedProject.title}</h3>

                        {!!expandedProject.miniTitle && <p className="project-heroMiniTitle">{expandedProject.miniTitle}</p>}

                        {/* ✅ Only show this in EN (avoid duplication in AM) */}
                        {showTopInstagramInExpanded(expandedProject) && (
                          <div className="project-socialRow" aria-label="Social links">
                            <button
                              type="button"
                              className="project-instagramBtn"
                              onClick={() => onOpen(expandedProject.instagram.url)}
                              aria-label={expandedProject.instagram.label || "Instagram"}
                            >
                              <span className="project-instagramGlow" aria-hidden="true" />
                              <InstagramIcon className="project-instagramIcon" />
                              <span className="project-instagramText">
                                {expandedProject.instagram.label || (lang === "am" ? "በኢንስታግራም ይከተሉን" : "Follow us on Instagram")}
                              </span>
                            </button>
                          </div>
                        )}

                        <p className="project-heroLead">
                          {expandedProject.shortDescription ||
                            (lang === "am" ? "ስለዚህ ፕሮጀክት ዝርዝር መረጃ በቅርቡ ይጨመራል።" : "Details for this project will be added soon.")}
                        </p>

                        {/* ✅ Hero visual */}
                        {hasCarousel(expandedProject) ? (
                          <div className="project-heroMediaWrap">
                            <MovingCarousel images={expandedProject.carouselImages} speed={24} variant="hero" />
                          </div>
                        ) : expandedProject.heroImageUrl ? (
                          <div className="project-heroImageWrap">
                            <img
                              src={expandedProject.heroImageUrl}
                              alt={expandedProject.heroImageAlt || expandedProject.title}
                              className="project-expanded__image"
                              loading="lazy"
                            />
                          </div>
                        ) : null}

                        {(expandedProject.supportTitle || expandedProject.supportItems?.length) && (
                          <div className="project-supportBox">
                            <p className="project-supportBox__title">
                              {expandedProject.supportTitle || (lang === "am" ? "እንዴት ልትረዱ ትችላላችሁ?" : "How you can support")}
                            </p>

                            {expandedProject.supportItems?.length > 0 && (
                              <ul className="project-supportBox__list">
                                {expandedProject.supportItems.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    </aside>

                    {/* RIGHT */}
                    <div className="project-expanded__right">
                      <div className="project-doc">
                        {expandedProject.longDescription ? (
                          renderFormattedText(null, expandedProject.longDescription)
                        ) : (
                          <p className="project-expanded__fallback">{lang === "am" ? "ዝርዝር መረጃ በቅርቡ ይጨመራል።" : "More details will be added soon."}</p>
                        )}
                      </div>

                      {/* ✅ ACTIONS: Youth uses Instagram CTA */}
                      <div className="project-expanded__actions">
                        {isYouth(expandedProject) && youthInstaUrl ? (
                          <button
                            type="button"
                            className="project-expanded__button project-expanded__button--instagram"
                            onClick={() => onOpen(youthInstaUrl)}
                            aria-label="Instagram"
                          >
                            <InstagramIcon className="project-actionIcon" />
                            <span>{lang === "am" ? "Instagram ይከተሉን" : "Follow on Instagram"}</span>
                          </button>
                        ) : expandedProject.cta?.url ? (
                          <button type="button" className="project-expanded__button" onClick={() => onOpen(expandedProject.cta.url)}>
                            {expandedProject.cta.label || (lang === "am" ? "ይለግሱ" : "Donate Now")}
                          </button>
                        ) : (
                          <button type="button" className="project-expanded__button" onClick={() => setExpandedKey(null)}>
                            {lang === "am" ? "ተመለስ" : "Back to projects"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* GRID */}
            <div className={`projects-grid ${showAllProjects ? "projects-grid--expanded" : ""}`}>
              {allProjects.map((project, index) => {
                const isActive = expandedKey === project.__key;
                const showInstaTop = isYouth(project) && !!project.instagram?.url; // top-right icon on card is fine for both

                return (
                  <article key={project.__key} className={`project-card ${isActive ? "project-card--active" : ""}`} data-index={index}>
                    {/* ✅ Card media: carousel if present, else hero image */}
                    {hasCarousel(project) ? (
                      <div className="project-image-wrapper">
                        <MovingCarousel images={project.carouselImages} speed={22} variant="card" />
                        <div className="project-image-overlay" />
                      </div>
                    ) : project.heroImageUrl ? (
                      <div className="project-image-wrapper">
                        <img src={project.heroImageUrl} alt={project.heroImageAlt || project.title} className="project-image" loading="lazy" />
                        <div className="project-image-overlay" />
                      </div>
                    ) : null}

                    <div className="project-body">
                      <div className="project-meta-top">
                        <span className={`project-status-pill project-status-pill--${project.status || "planned"}`}>
                          {getStatusLabel(project.status)}
                        </span>

                        <div className="project-metaRight">
                          {project.startDate && <span className="project-date">{formatDate(project.startDate)}</span>}

                          {/* ✅ Insta icon at top-right of card */}
                          {showInstaTop && (
                            <button
                              type="button"
                              className="project-instaPill"
                              onClick={() => onOpen(project.instagram.url)}
                              aria-label={project.instagram.label || "Instagram"}
                              title={project.instagram.label || "Instagram"}
                            >
                              <span className="project-instaPill__glow" aria-hidden="true" />
                              <InstagramIcon />
                            </button>
                          )}
                        </div>
                      </div>

                      <h3 className="project-title">{project.title}</h3>

                      {!!project.miniTitle && <p className="project-miniTitle">{project.miniTitle}</p>}

                      <p className="project-description">
                        {project.shortDescription ||
                          (lang === "am" ? "ስለዚህ ፕሮጀክት ዝርዝር መረጃ በቅርቡ ይጨመራል።" : "Details for this project will be added soon.")}
                      </p>

                      {project.longDescription && (
                        <button type="button" className="project-read-more-btn" onClick={() => toggleProject(project.__key)} aria-expanded={isActive}>
                          {isActive ? (lang === "am" ? "ዝርዝር ዝጋ" : "Close") : lang === "am" ? "ተጨማሪ ያንብቡ" : "Read more"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Show more on mobile */}
            {allProjects.length > 2 && (
              <div className="projects-more-wrapper">
                <button type="button" className="projects-more-btn" onClick={toggleShowAllProjects}>
                  {showAllProjects ? (lang === "am" ? "ያጣሩ" : "Show fewer projects") : lang === "am" ? "ተጨማሪ ፕሮጀክቶች ይመልከቱ" : "Show more projects"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default Projects;

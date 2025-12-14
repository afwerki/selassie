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
      : "Explore our current and planned projects, and learn how you can support them.");

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
    if (s === "ongoing") return lang === "am" ? "ቀጣይ" : "Ongoing";
    return lang === "am" ? "የሚጀምር" : "Planned";
  };

  const toggleProject = (key) => setExpandedKey((cur) => (cur === key ? null : key));
  const toggleShowAllProjects = () => setShowAllProjects((p) => !p);

  const onOpen = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* ============================================================
     Lightweight Markdown-like renderer (no dependencies)
     Supports:
     - ## Heading / ### subheading
     - --- divider
     - - bullet lists
     - 1. numbered lists
     - **bold**
     - URLs
  ============================================================ */

  const parseInline = (text) => {
    if (!text) return null;

    // Split by URLs first so we can link them
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

      // Bold **text**
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
      if (line.trim() === "") {
        flush();
      } else {
        buf.push(line);
      }
    }
    flush();

    const nodes = [];

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const first = block[0].trim();

      // Divider ---
      if (/^---+$/.test(first)) {
        nodes.push(<hr key={`hr-${i}`} className="project-divider" />);
        continue;
      }

      // Headings
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

      // Unordered list
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

      // Ordered list
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

      // “Donate Now” block (nice callout)
      const textJoined = block.join(" ").toLowerCase();
      const looksLikeDonate = textJoined.includes("donate") && textJoined.includes("http");
      if (looksLikeDonate) {
        nodes.push(
          <div key={`donate-${i}`} className="project-callout">
            {block.map((l, idx) => (
              <p key={`donp-${i}-${idx}`} className="project-p">
                {parseInline(l)}
              </p>
            ))}
          </div>
        );
        continue;
      }

      // Default paragraphs
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

  return (
    <main className="page" id="projects">
      <section className="section-header projects-page-header">
        <h2>{pageTitle}</h2>
        <p>{pageIntro}</p>
      </section>

      <section className="projects-section">
        {allProjects.length === 0 && (
          <p className="projects-empty">
            {lang === "am"
              ? "ፕሮጀክቶች ከCMS በመጨመር በኋላ በዚህ ይታያሉ።"
              : "Projects will appear here once they are published."}
          </p>
        )}

        {allProjects.length > 0 && (
          <>
            {/* FULL-WIDTH EXPANDED PANEL */}
            {expandedProject && (
              <section className="project-expanded" ref={expandedRef} aria-label="Project details">
                <div className="project-expanded__inner">
                  <div className="project-expanded__header">
                    <div className="project-expanded__meta">
                      <span
                        className={`project-status-pill project-status-pill--${
                          expandedProject.status || "planned"
                        }`}
                      >
                        {getStatusLabel(expandedProject.status)}
                      </span>

                      {expandedProject.startDate && (
                        <span className="project-date">{formatDate(expandedProject.startDate)}</span>
                      )}
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
                    {/* LEFT: “hero summary” */}
                    <aside className="project-expanded__left">
                      <div className="project-heroCard">
                        <h3 className="project-heroTitle">{expandedProject.title}</h3>

                        {!!expandedProject.miniTitle && (
                          <p className="project-heroMiniTitle">{expandedProject.miniTitle}</p>
                        )}

                        <p className="project-heroLead">
                          {expandedProject.shortDescription ||
                            (lang === "am"
                              ? "ስለዚህ ፕሮጀክት ዝርዝር መረጃ በቅርቡ ታከትታለች።"
                              : "Details for this project will be added soon.")}
                        </p>

                        {expandedProject.heroImageUrl && (
                          <div className="project-heroImageWrap">
                            <img
                              src={expandedProject.heroImageUrl}
                              alt={expandedProject.heroImageAlt || expandedProject.title}
                              className="project-expanded__image"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Support (nice mini section) */}
                        {(expandedProject.supportTitle || expandedProject.supportItems?.length) && (
                          <div className="project-supportBox">
                            <p className="project-supportBox__title">
                              {expandedProject.supportTitle ||
                                (lang === "am" ? "እንዴት ልትረዱ ትችላላችሁ?" : "How you can support")}
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

                        {expandedProject.mediaHints?.length > 0 && (
                          <div className="project-media-hints">
                            <p className="project-media-hints__title">
                              {lang === "am" ? "የምስል ሀሳቦች" : "Suggested photos"}
                            </p>
                            <ul className="project-media-hints__list">
                              {expandedProject.mediaHints.map((hint) => (
                                <li key={hint}>{hint}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </aside>

                    {/* RIGHT: ONE continuous scroll area */}
                    <div className="project-expanded__right">
                      <div className="project-expanded__scroll project-doc">
                        {expandedProject.longDescription ? (
                          renderFormattedText(null, expandedProject.longDescription)
                        ) : (
                          <p className="project-expanded__fallback">
                            {lang === "am"
                              ? "ዝርዝር መረጃ በቅርቡ ይጨመራል።"
                              : "More details will be added soon."}
                          </p>
                        )}
                      </div>

                      <div className="project-expanded__actions">
                        {expandedProject.cta?.url ? (
                          <button
                            type="button"
                            className="project-expanded__button"
                            onClick={() => onOpen(expandedProject.cta.url)}
                          >
                            {expandedProject.cta.label || (lang === "am" ? "ይለግሱ" : "Donate Now")}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="project-expanded__button"
                            onClick={() => setExpandedKey(null)}
                          >
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

                return (
                  <article
                    key={project.__key}
                    className={`project-card ${isActive ? "project-card--active" : ""}`}
                    data-index={index}
                  >
                    {project.heroImageUrl && (
                      <div className="project-image-wrapper">
                        <img
                          src={project.heroImageUrl}
                          alt={project.heroImageAlt || project.title}
                          className="project-image"
                          loading="lazy"
                        />
                        <div className="project-image-overlay" />
                      </div>
                    )}

                    <div className="project-body">
                      <div className="project-meta-top">
                        <span
                          className={`project-status-pill project-status-pill--${
                            project.status || "planned"
                          }`}
                        >
                          {getStatusLabel(project.status)}
                        </span>

                        {project.startDate && (
                          <span className="project-date">{formatDate(project.startDate)}</span>
                        )}
                      </div>

                      <h3 className="project-title">{project.title}</h3>

                      {!!project.miniTitle && <p className="project-miniTitle">{project.miniTitle}</p>}

                      <p className="project-description">
                        {project.shortDescription ||
                          (lang === "am"
                            ? "ስለዚህ ፕሮጀክት ዝርዝር መረጃ በቅርቡ ታከትታለች።"
                            : "Details for this project will be added soon.")}
                      </p>

                      {project.longDescription && (
                        <button
                          type="button"
                          className="project-read-more-btn"
                          onClick={() => toggleProject(project.__key)}
                          aria-expanded={isActive}
                        >
                          {isActive
                            ? lang === "am"
                              ? "ዝርዝር ዝጋ"
                              : "Close"
                            : lang === "am"
                            ? "ተጨማሪ ያንብቡ"
                            : "Read more"}
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
          </>
        )}
      </section>
    </main>
  );
}

export default Projects;

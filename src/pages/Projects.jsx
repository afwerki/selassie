import React, { useState, useEffect } from "react";
import "../styling/projects.css";
import { useLanguage } from "../contexts/LanguageContext";
import { texts } from "../i18n/texts";

function Projects() {
  const { lang } = useLanguage();
  const t = texts[lang] || texts.en;

  const projectTexts = t.projects || {};
  const items = projectTexts.items || [];

  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [showAllProjects, setShowAllProjects] = useState(false);

  // When language changes, reset expansions so the UI feels clean
  useEffect(() => {
    setExpandedProjectId(null);
    setShowAllProjects(false);
  }, [lang]);

  const toggleProjectReadMore = (projectId) => {
    setExpandedProjectId((current) => (current === projectId ? null : projectId));
  };

  const toggleShowAllProjects = () => {
    setShowAllProjects((prev) => !prev);
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

  return (
    <main className="page" id="projects">
      {/* HEADER */}
      <section className="section-header projects-page-header">
        <h2>{projectTexts.pageTitle}</h2>
        <p>{projectTexts.pageIntro}</p>
      </section>

      {/* CONTENT */}
      <section className="projects-section">
        {items.length === 0 && (
          <p className="projects-empty">
            {lang === "am"
              ? "ፕሮጀክቶች ከCMS በመጨመር በኋላ በዚህ ይታያሉ።"
              : "Projects will appear here once they are published."}
          </p>
        )}

        {items.length > 0 && (
          <>
            <div
              className={`projects-grid ${
                showAllProjects ? "projects-grid--expanded" : ""
              }`}
            >
              {items.map((project, index) => {
                const isExpanded = expandedProjectId === project.id;
                const status = project.status || "planned";

                const statusLabel =
                  status === "completed"
                    ? lang === "am"
                      ? "ተጠናቀቀ"
                      : "Completed"
                    : status === "in_progress"
                    ? lang === "am"
                      ? "በመካከለኛ ሂደት"
                      : "In progress"
                    : lang === "am"
                    ? "የሚጀምር"
                    : "Planned";

                return (
                  <article
                    key={project.id || `proj-${index}`}
                    className="project-card"
                    data-index={index}
                  >
                    {/* If you later add heroImageUrl to texts.projects.items, it will show here */}
                    {project.heroImageUrl && (
                      <div className="project-image-wrapper">
                        <img
                          src={project.heroImageUrl}
                          alt={project.title}
                          className="project-image"
                        />
                        <div className="project-image-overlay" />
                      </div>
                    )}

                    <div className="project-body">
                      <div className="project-meta-top">
                        <span
                          className={`project-status-pill project-status-pill--${status}`}
                        >
                          {statusLabel}
                        </span>

                        {project.startDate && (
                          <span className="project-date">
                            {formatDate(project.startDate)}
                          </span>
                        )}
                      </div>

                      <h3 className="project-title">{project.title}</h3>

                      <div
                        className={`project-description ${
                          isExpanded
                            ? "project-description--expanded"
                            : "project-description--collapsed"
                        }`}
                      >
                        <p>
                          {project.shortDescription ||
                            (lang === "am"
                              ? "ስለዚህ ፕሮጀክት ዝርዝር መረጃ በቅርቡ ታከትታለች።"
                              : "Details for this project will be added soon.")}
                        </p>

                        {project.longDescription && (
                          <p className="project-long-text">
                            {project.longDescription}
                          </p>
                        )}
                      </div>

                      {project.longDescription && (
                        <button
                          type="button"
                          className="project-read-more-btn"
                          onClick={() => toggleProjectReadMore(project.id)}
                        >
                          {isExpanded
                            ? lang === "am"
                              ? "ያጠፉ"
                              : "Show less"
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

            {/* Show more on mobile when there are more than 2 */}
            {items.length > 2 && (
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
          </>
        )}
      </section>
    </main>
  );
}

export default Projects;

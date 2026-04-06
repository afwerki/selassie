import React from "react";

function toPlainText(value = "") {
  return String(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, "")
    .trim();
}

function getStructuredField(text = "", label = "") {
  if (!text || !label) return "";

  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^\\s*${escaped}\\s*:\\s*(.+)\\s*$`, "im");
  const match = text.match(regex);

  return match?.[1]?.trim() || "";
}

function getCleanExcerpt(item) {
  const directExcerpt = String(item?.excerpt || "").trim();
  if (directExcerpt) return directExcerpt;

  const raw = toPlainText(item?.description || "");
  if (!raw) return "";

  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const filtered = lines.filter((line) => {
    const lower = line.toLowerCase();
    return !(
      lower.startsWith("author:") ||
      lower.startsWith("speaker:") ||
      lower.startsWith("series:") ||
      lower.startsWith("pdf:") ||
      lower.startsWith("youtube:") ||
      lower.startsWith("tags:") ||
      lower.startsWith("language:") ||
      lower.startsWith("excerpt:")
    );
  });

  const joined = filtered.join(" ").replace(/\s+/g, " ").trim();
  if (joined) return joined;

  const structuredExcerpt = getStructuredField(raw, "Excerpt");
  return structuredExcerpt || "";
}

function getAuthor(item) {
  return (
    item?.author ||
    getStructuredField(item?.description || "", "Author") ||
    getStructuredField(item?.description || "", "Speaker") ||
    "Debre-Genet Holy Trinity"
  );
}

function getSeries(item) {
  return (
    item?.series ||
    getStructuredField(item?.description || "", "Series") ||
    "Reading Material"
  );
}

function getLanguage(item) {
  return getStructuredField(item?.description || "", "Language") || "";
}

function getPdfUrl(item) {
  return (
    item?.pdfUrl ||
    getStructuredField(item?.description || "", "PDF") ||
    ""
  );
}

export default function TeachingsTab({
  loading,
  visibleTeachings,
  filteredTeachings,
  searchIsActive,
  defaultLatest,
  formatDate,
}) {
  return (
    <div className="tab-panel active">
      {loading && (
        <div className="sermons-skeleton-grid sermons-skeleton-grid--teachings">
          <div className="sermons-skeleton-card sermons-skeleton-card--t" />
          <div className="sermons-skeleton-card sermons-skeleton-card--t" />
          <div className="sermons-skeleton-card sermons-skeleton-card--t" />
        </div>
      )}

      {!loading && visibleTeachings.length === 0 && (
        <div className="sermons-empty">
          No reading materials found. Try another search or choose a different tag.
        </div>
      )}

      {!loading && visibleTeachings.length > 0 && (
        <div className="teaching-grid">
          {visibleTeachings.map((d, index) => {
            const author = getAuthor(d);
            const series = getSeries(d);
            const language = getLanguage(d);
            const pdfUrl = getPdfUrl(d);
            const cleanExcerpt = getCleanExcerpt(d);

            return (
              <article
                key={d._id}
                className="teaching-card wow-stagger"
                style={{ "--stagger": index }}
              >
                {d.heroImageUrl && (
                  <div className="teaching-media">
                    <img src={d.heroImageUrl} alt={d.title} loading="lazy" />
                  </div>
                )}

                <div className="teaching-top">
                  <span className="tag-pill">{series}</span>
                  {d.isFeatured && (
                    <span className="featured-pill featured-pill--soft">
                      Featured
                    </span>
                  )}
                </div>

                <h3>{d.title}</h3>

                <div className="sermons-submeta sermons-submeta--teaching">
                  <span className="sermons-submeta-item">
                    <strong>Author:</strong> {author}
                  </span>

                  {language ? (
                    <span className="sermons-submeta-item">{language}</span>
                  ) : null}

                  {d.publishedAt ? (
                    <span className="sermons-submeta-item">
                      {formatDate(d.publishedAt)}
                    </span>
                  ) : null}
                </div>

                <p className="teaching-excerpt teaching-excerpt--clamp">
                  {cleanExcerpt ||
                    "Explore this church reading material for teaching, reflection, and spiritual encouragement."}
                </p>

                <div className="teaching-actions">
                  {pdfUrl ? (
                    <a
                      className="teaching-btn"
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Reading Material
                    </a>
                  ) : (
                    <span className="teaching-btn teaching-btn--disabled">
                      Reading material coming soon
                    </span>
                  )}
                </div>

                {(d.topicTags?.length || 0) > 0 && (
                  <div className="mini-tags">
                    {d.topicTags.slice(0, 5).map((tag) => (
                      <span key={tag} className="mini-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {!loading && !searchIsActive && filteredTeachings.length > defaultLatest && (
        <div className="sermons-more-note">
          More reading materials are available — use search or tags to explore more.
        </div>
      )}
    </div>
  );
}
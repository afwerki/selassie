import React from "react";

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
          {visibleTeachings.map((d, index) => (
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
                <span className="tag-pill">{d.series || "Reading Material"}</span>
                {d.isFeatured && (
                  <span className="featured-pill featured-pill--soft">Featured</span>
                )}
              </div>

              <h3>{d.title}</h3>

              <p className="card-meta">
                {(d.author || "Debre-Genet Holy Trinity")}
                {d.publishedAt ? ` • ${formatDate(d.publishedAt)}` : ""}
              </p>

              <p>
                {d.excerpt ||
                  "Explore this church reading material for teaching, reflection, and spiritual encouragement."}
              </p>

              <div className="teaching-actions">
                {d.pdfUrl ? (
                  <a
                    className="teaching-btn"
                    href={d.pdfUrl}
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
          ))}
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
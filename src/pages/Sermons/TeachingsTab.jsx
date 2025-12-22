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
        <div className="sermons-empty">No teachings found. Try a different search or tag.</div>
      )}

      {!loading && visibleTeachings.length > 0 && (
        <div className="teaching-grid">
          {visibleTeachings.map((d) => (
            <article key={d._id} className="teaching-card">
              {d.heroImageUrl && (
                <div className="teaching-media">
                  <img src={d.heroImageUrl} alt={d.title} loading="lazy" />
                </div>
              )}

              <div className="teaching-top">
                <span className="tag-pill">{d.series || "Written Teaching"}</span>
                {d.isFeatured && <span className="featured-pill featured-pill--soft">Featured</span>}
              </div>

              <h3>{d.title}</h3>

              <p className="card-meta">
                {(d.author || "Selassie Church")}
                {d.publishedAt ? ` • ${formatDate(d.publishedAt)}` : ""}
              </p>

              <p>{d.excerpt || "A written teaching from our church — open to read more."}</p>

              <div className="teaching-actions">
                {d.pdfUrl ? (
                  <a className="teaching-btn" href={d.pdfUrl} target="_blank" rel="noreferrer">
                    Open PDF
                  </a>
                ) : (
                  <span className="teaching-btn teaching-btn--disabled">PDF coming soon</span>
                )}
              </div>

              {(d.topicTags?.length || 0) > 0 && (
                <div className="mini-tags">
                  {d.topicTags.slice(0, 5).map((tag) => (
                    <span key={tag} className="mini-tag">{tag}</span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {!loading && !searchIsActive && filteredTeachings.length > defaultLatest && (
        <div className="sermons-more-note">More teachings are available — use the search box to find them.</div>
      )}
    </div>
  );
}

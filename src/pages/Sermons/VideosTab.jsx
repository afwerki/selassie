import React from "react";

const YT_THUMB = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export default function VideosTab({
  loading,
  visibleVideos,
  filteredVideos,
  searchIsActive,
  defaultLatest,
  formatDate,
  onOpenVideo,
}) {
  return (
    <div className="tab-panel active">
      {loading && (
        <div className="sermons-skeleton-grid">
          <div className="sermons-skeleton-card" />
          <div className="sermons-skeleton-card" />
        </div>
      )}

      {!loading && visibleVideos.length === 0 && (
        <div className="sermons-empty">No videos found. Try a different search or tag.</div>
      )}

      {!loading && visibleVideos.length > 0 && (
        <div className="video-grid">
          {visibleVideos.map((v) => {
            const thumb = v.thumbnailUrl || (v.youtubeId ? YT_THUMB(v.youtubeId) : "");
            return (
              <article key={v._id} className="video-card video-card--thumb">
                <button
                  type="button"
                  className="video-thumb"
                  onClick={() => onOpenVideo(v)}
                  aria-label={`Play: ${v.title}`}
                >
                  {thumb ? <img src={thumb} alt={v.title} loading="lazy" /> : <div className="video-thumb-fallback" />}
                  <div className="video-thumb-overlay" />
                  <div className="video-play">
                    <span className="video-play-icon">▶</span>
                    <span className="video-play-label">Play</span>
                  </div>
                  {v.isFeatured && <span className="featured-pill">Featured</span>}
                </button>

                <div className="video-info">
                  <p className="sermons-meta">
                    {(v.series || "Sermon")}
                    {v.speaker ? ` • ${v.speaker}` : ""}
                    {v.publishedAt ? ` • ${formatDate(v.publishedAt)}` : ""}
                  </p>

                  <h3>{v.title}</h3>

                  {/* Long description scroll */}
                  {v.description && <div className="video-desc">{v.description}</div>}

                  {(v.topicTags?.length || 0) > 0 && (
                    <div className="mini-tags">
                      {v.topicTags.slice(0, 4).map((tag) => (
                        <span key={tag} className="mini-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loading && !searchIsActive && filteredVideos.length > defaultLatest && (
        <div className="sermons-more-note">More videos are available — use the search box to find them.</div>
      )}
    </div>
  );
}

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
        <div className="sermons-empty">
          No videos found. Try another search or choose a different tag.
        </div>
      )}

      {!loading && visibleVideos.length > 0 && (
        <div className="video-grid video-grid--youtube">
          {visibleVideos.map((v, index) => {
            const thumb = v.youtubeId ? YT_THUMB(v.youtubeId) : v.thumbnailUrl || "";

            return (
              <article
                key={v._id}
                className="video-card video-card--youtube wow-stagger"
                style={{ "--stagger": index }}
              >
                <button
                  type="button"
                  className="video-frame"
                  onClick={() => onOpenVideo(v)}
                  aria-label={`Play: ${v.title}`}
                >
                  {thumb ? (
                    <img src={thumb} alt={v.title} loading="lazy" />
                  ) : (
                    <div className="video-thumb-fallback" />
                  )}

                  <div className="video-thumb-overlay" />

                  <div className="video-play video-play--center">
                    <span className="video-play-icon">▶</span>
                  </div>

                  {v.isFeatured && <span className="featured-pill">Featured</span>}
                </button>

                <div className="video-info video-info--youtube">
                  <p className="sermons-meta">
                    {v.series || "Sermon Video"}
                    {v.speaker ? ` • ${v.speaker}` : ""}
                    {v.publishedAt ? ` • ${formatDate(v.publishedAt)}` : ""}
                  </p>

                  <h3>{v.title}</h3>

                  {v.description && (
                    <p className="video-desc video-desc--clamp">
                      {v.description}
                    </p>
                  )}

                  {(v.topicTags?.length || 0) > 0 && (
                    <div className="mini-tags">
                      {v.topicTags.slice(0, 4).map((tag) => (
                        <span key={tag} className="mini-tag">
                          {tag}
                        </span>
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
        <div className="sermons-more-note">
          More videos are available — use search or tags to explore more.
        </div>
      )}
    </div>
  );
}
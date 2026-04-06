import React from "react";

const YT_THUMB = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

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

function getCleanDescription(video) {
  const raw = toPlainText(video?.description || "");
  if (!raw) return "";

  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const filtered = lines.filter((line) => {
    const lower = line.toLowerCase();
    return !(
      lower.startsWith("speaker:") ||
      lower.startsWith("series:") ||
      lower.startsWith("youtube:") ||
      lower.startsWith("tags:") ||
      lower.startsWith("language:") ||
      lower.startsWith("pdf:") ||
      lower.startsWith("author:")
    );
  });

  return filtered.join(" ").replace(/\s+/g, " ").trim();
}

function getSpeaker(video) {
  return (
    video?.speaker ||
    getStructuredField(video?.description || "", "Speaker") ||
    ""
  );
}

function getSeries(video) {
  return (
    video?.series ||
    getStructuredField(video?.description || "", "Series") ||
    ""
  );
}

function getLanguage(video) {
  return getStructuredField(video?.description || "", "Language") || "";
}

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
            const speaker = getSpeaker(v);
            const series = getSeries(v);
            const language = getLanguage(v);
            const cleanDescription = getCleanDescription(v);

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
                  <div className="sermons-meta-row">
                    {series ? (
                      <span className="sermons-meta-pill sermons-meta-pill--gold">
                        {series}
                      </span>
                    ) : (
                      <span className="sermons-meta-pill sermons-meta-pill--gold">
                        Sermon Video
                      </span>
                    )}

                    {v.publishedAt ? (
                      <span className="sermons-meta-date">
                        {formatDate(v.publishedAt)}
                      </span>
                    ) : null}
                  </div>

                  <h3>{v.title}</h3>

                  {(speaker || language) && (
                    <div className="sermons-submeta">
                      {speaker ? (
                        <span className="sermons-submeta-item">
                          <strong>Speaker:</strong> {speaker}
                        </span>
                      ) : null}

                      {language ? (
                        <span className="sermons-submeta-item">{language}</span>
                      ) : null}
                    </div>
                  )}

                  {cleanDescription && (
                    <p className="video-desc video-desc--clamp">
                      {cleanDescription}
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
import React, { useEffect, useState } from "react";
import "../styling/events.css";
import { useLanguage } from "../contexts/LanguageContext";
import { sectionTexts } from "../i18n/sectionTexts";
import { client } from "../sanityClient";

function Events() {
  const { lang } = useLanguage();
  const tRoot = sectionTexts[lang] || sectionTexts.en;
  const t = tRoot.events;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // ---------- helpers -------------------------------------------------

  const formatDay = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit" });
    } catch {
      return "";
    }
  };

  const formatMonth = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso)
        .toLocaleDateString("en-GB", { month: "short" })
        .toUpperCase();
    } catch {
      return "";
    }
  };

  const formatTimeRange = (startIso, endIso) => {
    if (!startIso) return "";
    try {
      const start = new Date(startIso);
      const startTime = start.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (!endIso) return startTime;

      const end = new Date(endIso);
      const endTime = end.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (start.toDateString() === end.toDateString()) {
        return `${startTime} – ${endTime}`;
      }
      return `${startTime} → ${endTime}`;
    } catch {
      return "";
    }
  };

  const formatFullDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("en-GB", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  // ---------- load events from Sanity (with fallback) -----------------

  useEffect(() => {
    const query = `
      *[_type == "event" && isActive == true && defined(startDateTime)]
        | order(startDateTime asc) {
        _id,
        title,
        shortSummary,
        description,
        location,
        address,
        mapLink,
        startDateTime,
        endDateTime,
        "imageUrl": mainImage.asset->url
      }
    `;

    const buildFallback = () =>
      (t.upcoming || []).map((e, index) => ({
        id: e.id || `fallback-${index}`,
        title: e.title,
        summary: e.description,
        description: e.description,
        day: e.day,
        month: e.month,
        fullDateLabel: "",
        timeLabel: e.meta || e.timeLabel || "",
        location: e.location || "",
        address: e.address || "",
        mapLink: e.mapLink || "",
        imageUrl: e.imageUrl || "",
      }));

    client
      .fetch(query)
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          setEvents(buildFallback());
          return;
        }

        const mapped = data.map((ev, index) => ({
          id: ev._id || `event-${index}`,
          title: ev.title || "Untitled event",
          summary: ev.shortSummary || "",
          description: ev.description || "",
          day: formatDay(ev.startDateTime),
          month: formatMonth(ev.startDateTime),
          fullDateLabel: formatFullDate(ev.startDateTime),
          timeLabel: formatTimeRange(ev.startDateTime, ev.endDateTime),
          location: ev.location || "",
          address: ev.address || "",
          mapLink: ev.mapLink || "",
          imageUrl: ev.imageUrl || "",
        }));

        setEvents(mapped);
      })
      .catch((err) => {
        console.error("Error loading events from Sanity:", err);
        setEvents(buildFallback());
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- UI state helpers ----------------------------------------

  const toggleDetails = (id) => {
    // only one open at a time
    setOpenId((current) => (current === id ? null : id));
  };

  const visibleEvents = showAll ? events : events.slice(0, 2);

  const viewMoreLabel = t.viewMoreLabel || "View more events";
  const viewLessLabel = t.viewLessLabel || "Show fewer events";
  const viewDetailsLabel = t.viewDetailsLabel || "View details";
  const hideDetailsLabel = t.hideDetailsLabel || "Hide details";

  // ---------- render ---------------------------------------------------

  return (
    <main className="page events-page" id="events">
      <section className="section-header events-header animate-fade-up">
        <div className="events-header-badge">Church Calendar</div>
        <h2>{t.sectionTitle}</h2>
        <p>{t.sectionIntro}</p>
      </section>

      <section className="event-grid animate-fade-up">
        {loading && (
          <p className="event-loading">
            Loading events from the church calendar…
          </p>
        )}

        {!loading && events.length === 0 && (
          <p className="event-empty">
            No upcoming events are scheduled at the moment. Please check back
            soon.
          </p>
        )}

        {!loading &&
          visibleEvents.map((event, index) => {
            const isOpen = openId === event.id;

            return (
              <article
                key={event.id}
                className={`event-card event-card--compact ${
                  isOpen ? "event-card--open" : ""
                }`}
                style={{ animationDelay: `${0.05 + index * 0.07}s` }}
              >
                <div className="event-inner">
                  {/* IMAGE + DATE PILL */}
                  <div className="event-thumb">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.title} />
                    ) : (
                      <div className="event-thumb-placeholder" />
                    )}
                    <div className="event-mini-date">
                      <span className="event-mini-day">{event.day}</span>
                      <span className="event-mini-month">{event.month}</span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="event-body">
                    <button
                      type="button"
                      className="event-main-click"
                      onClick={() => toggleDetails(event.id)}
                    >
                      <h3 className="event-title">{event.title}</h3>

                      {(event.timeLabel || event.location) && (
                        <p className="event-meta">
                          {event.timeLabel && (
                            <span className="time">{event.timeLabel}</span>
                          )}
                          {event.location && (
                            <span className="location">
                              {event.location}
                            </span>
                          )}
                        </p>
                      )}

                      {event.summary && (
                        <p className="event-summary">{event.summary}</p>
                      )}

                      <span className="event-toggle-hint">
                        {isOpen ? hideDetailsLabel : viewDetailsLabel}
                      </span>
                    </button>

                    <div
                      className={`event-details-panel ${
                        isOpen ? "event-details-panel--open" : ""
                      }`}
                    >
                      {event.fullDateLabel && (
                        <p className="event-details-row">
                          <strong>Date:&nbsp;</strong>
                          <span>{event.fullDateLabel}</span>
                        </p>
                      )}

                      {event.timeLabel && (
                        <p className="event-details-row">
                          <strong>Time:&nbsp;</strong>
                          <span>{event.timeLabel}</span>
                        </p>
                      )}

                      {event.location && (
                        <p className="event-details-row">
                          <strong>Location:&nbsp;</strong>
                          <span>{event.location}</span>
                        </p>
                      )}

                      {event.address && (
                        <div className="event-details-row event-details-address">
                          <strong>Address:&nbsp;</strong>
                          <div>
                            {event.address.split("\n").map((line, idx) => (
                              <span key={idx}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.mapLink && (
                        <p className="event-details-row">
                          <a
                            href={event.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="event-map-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View on Google Maps
                          </a>
                        </p>
                      )}

                      {event.description && (
                        <p className="event-details-description">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
      </section>

      {!loading && events.length > 2 && (
        <div className="events-show-more-wrapper">
          <button
            type="button"
            className="events-show-more-btn"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? viewLessLabel : viewMoreLabel}
          </button>
        </div>
      )}
    </main>
  );
}

export default Events;

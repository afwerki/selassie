import React, { useEffect, useMemo, useState } from "react";
import "../styling/events.css";
import { useLanguage } from "../contexts/LanguageContext";
import { sectionTexts } from "../i18n/sectionTexts";

const EVENTS_FEED_URL =
  "https://dght.churchsuite.com/-/calendar/4b62ba5d-f1b0-45e3-86bc-7ac1e497980b/json";

/**
 * Exclude sermon / reading categories from the Events page.
 * Category 13 = Sermons / Videos
 * Category 14 = Readings / PDFs
 */
const EXCLUDED_CATEGORY_IDS = [13, 14];

const EXCLUDED_CATEGORY_KEYWORDS = [
  "sermon",
  "sermons",
  "reading",
  "readings",
  "teaching",
  "teachings",
];

const NEXT_EVENT_POPUP_STORAGE_KEY = "dght-next-event-popup-cooldown-v1";
const POPUP_COOLDOWN_MS = 30 * 60 * 1000;

function stripHtml(html = "") {
  return String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<li>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<ul[^>]*>/gi, "\n")
    .replace(/<\/ul>/gi, "\n")
    .replace(/<ol[^>]*>/gi, "\n")
    .replace(/<\/ol>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function truncateText(text = "", maxLength = 140) {
  const safe = String(text || "").trim();
  if (!safe) return "";
  if (safe.length <= maxLength) return safe;
  return `${safe.slice(0, maxLength).trim()}…`;
}

function parseDateSafe(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatFullDate(dateString, lang = "en") {
  const date = parseDateSafe(dateString);
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat(lang === "am" ? "am-ET" : "en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

function formatMonthYear(date, lang = "en") {
  if (!(date instanceof Date)) return "";

  try {
    return new Intl.DateTimeFormat(lang === "am" ? "am-ET" : "en-GB", {
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

function formatWeekdayShort(date, lang = "en") {
  if (!(date instanceof Date)) return "";

  try {
    return new Intl.DateTimeFormat(lang === "am" ? "am-ET" : "en-GB", {
      weekday: "short",
    }).format(date);
  } catch {
    return "";
  }
}

function formatTime(dateString, lang = "en") {
  const date = parseDateSafe(dateString);
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat(lang === "am" ? "am-ET" : "en-GB", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "";
  }
}

function formatEventRange(start, end, allDay, lang = "en") {
  if (!start) return "";
  if (allDay) return lang === "am" ? "ሙሉ ቀን" : "All day";

  const startTime = formatTime(start, lang);
  const endTime = end ? formatTime(end, lang) : "";
  return endTime ? `${startTime} – ${endTime}` : startTime;
}

function getEventImage(event) {
  return (
    event?.image?.large ||
    event?.image?.medium ||
    event?.image?.small ||
    event?.image?.thumbnail ||
    ""
  );
}

function sortByStartDateAsc(a, b) {
  const aTime = a?.startsAtDate?.getTime?.() ?? 0;
  const bTime = b?.startsAtDate?.getTime?.() ?? 0;
  return aTime - bTime;
}

function isUpcomingEvent(event) {
  if (!event?.startsAtDate) return false;

  const eventTime = event.startsAtDate.getTime();
  const now = Date.now();

  return eventTime >= now - 15 * 60 * 1000;
}

function getDayKeyFromDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayKeyFromEvent(event) {
  const date = parseDateSafe(event?.starts_at);
  if (!date) return "";
  return getDayKeyFromDate(date);
}

function isSameMonth(date, monthDate) {
  return (
    date.getFullYear() === monthDate.getFullYear() &&
    date.getMonth() === monthDate.getMonth()
  );
}

function getMonthGridDates(monthDate) {
  const firstOfMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    1
  );

  const startDay = firstOfMonth.getDay();
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - startDay);

  const dates = [];

  for (let i = 0; i < 42; i += 1) {
    const current = new Date(gridStart);
    current.setDate(gridStart.getDate() + i);
    dates.push(current);
  }

  return dates;
}

function isDisplayableStatus(status) {
  if (!status) return true;

  const safeStatus = String(status).trim().toLowerCase();
  return ["confirmed", "published", "active", "live"].includes(safeStatus);
}

function isExcludedEvent(event) {
  const categoryId = Number(event?.category_id);

  if (EXCLUDED_CATEGORY_IDS.includes(categoryId)) {
    return true;
  }

  const categoryText = String(
    event?.category?.name ||
      event?.category_name ||
      event?.category ||
      event?.category_slug ||
      ""
  ).toLowerCase();

  return EXCLUDED_CATEGORY_KEYWORDS.some((keyword) =>
    categoryText.includes(keyword)
  );
}

function normalizeEvent(event) {
  const cleanDescription = stripHtml(event?.description || "");

  return {
    ...event,
    cleanDescription,
    shortDescription: truncateText(cleanDescription, 120),
    imageSrc: getEventImage(event),
    dayKey: getDayKeyFromEvent(event),
    startsAtDate: parseDateSafe(event?.starts_at),
  };
}

function renderDescriptionLines(descriptionText) {
  const lines = String(descriptionText || "").split("\n");

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return (
        <div
          key={`space-${index}`}
          className="events-details-description-spacer"
          aria-hidden="true"
        />
      );
    }

    const isBullet = /^[-•]\s+/.test(trimmed);
    const isLabelLine = /^[A-Za-zÀ-ÿ\u1200-\u137F\s]+:\s*/.test(trimmed);

    if (isBullet) {
      return (
        <div
          key={`bullet-${trimmed}-${index}`}
          className="events-details-description-row events-details-description-row--bullet"
        >
          <span className="events-details-description-dot" aria-hidden="true" />
          <span className="events-details-description-text">
            {trimmed.replace(/^[-•]\s+/, "")}
          </span>
        </div>
      );
    }

    if (isLabelLine) {
      const [label, ...restParts] = trimmed.split(":");
      const rest = restParts.join(":").trim();

      return (
        <div
          key={`label-${trimmed}-${index}`}
          className="events-details-description-row events-details-description-row--label"
        >
          <span className="events-details-description-text">
            <strong>{label.trim()}:</strong> {rest}
          </span>
        </div>
      );
    }

    return (
      <div
        key={`line-${trimmed}-${index}`}
        className="events-details-description-row"
      >
        <span className="events-details-description-text">{trimmed}</span>
      </div>
    );
  });
}

function EventDetailsCard({ event, lang, onClose, variant = "modal" }) {
  if (!event) return null;

  const fallbackDescription =
    lang === "am"
      ? "ከቤተክርስቲያናችን ጋር በዚህ ፕሮግራም ይቀላቀሉ።"
      : "Join us for this upcoming church event and gathering.";

  const descriptionText = event.cleanDescription || fallbackDescription;
  const hasImage = Boolean(event.imageSrc);

  return (
    <div
      className={[
        "events-details-card",
        `events-details-card--${variant}`,
        !hasImage ? "events-details-card--no-image" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className="events-overlay-close"
        onClick={onClose}
        aria-label={lang === "am" ? "ዝጋ" : "Close"}
      >
        ×
      </button>

      {hasImage ? (
        <div className="events-details-media">
          <img
            src={event.imageSrc}
            alt={event.name || "Church event"}
            className="events-details-image"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="events-details-content">
        <div className="events-details-pill-row">
          <span className="events-details-pill">
            {lang === "am" ? "የቤተክርስቲያን ፕሮግራም" : "Church Event"}
          </span>

          {event.all_day ? (
            <span className="events-details-pill events-details-pill--soft">
              {lang === "am" ? "ሙሉ ቀን" : "All day"}
            </span>
          ) : null}
        </div>

        <h3>{event.name || (lang === "am" ? "ፕሮግራም" : "Event")}</h3>

        <div className="events-details-meta">
          <div className="events-details-meta-item">
            <span className="events-details-meta-label">
              {lang === "am" ? "ቀን" : "Date"}
            </span>
            <span>{formatFullDate(event.starts_at, lang)}</span>
          </div>

          <div className="events-details-meta-item">
            <span className="events-details-meta-label">
              {lang === "am" ? "ሰዓት" : "Time"}
            </span>
            <span>
              {formatEventRange(
                event.starts_at,
                event.ends_at,
                event.all_day,
                lang
              )}
            </span>
          </div>

          {(event.location?.name || event.location?.address) && (
            <div className="events-details-meta-item">
              <span className="events-details-meta-label">
                {lang === "am" ? "ቦታ" : "Location"}
              </span>
              <span>
                {event.location?.name || ""}
                {event.location?.address ? ` • ${event.location.address}` : ""}
              </span>
            </div>
          )}
        </div>

        <div className="events-details-description-wrap">
          <div className="events-details-description-label">
            {lang === "am" ? "ማብራሪያ" : "Description"}
          </div>

          <div className="events-details-description">
            {renderDescriptionLines(descriptionText)}
          </div>
        </div>

        <div className="events-details-actions">
          {event.url ? (
            <a
              href={event.url}
              target="_blank"
              rel="noreferrer"
              className="events-primary-button"
            >
              {lang === "am" ? "ወደ ፕሮግራሙ ገጽ" : "Open Event Page"}
            </a>
          ) : null}

          <button
            type="button"
            className="events-secondary-button"
            onClick={onClose}
          >
            {lang === "am" ? "ዝጋ" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Events() {
  const { lang } = useLanguage();
  const tRoot = sectionTexts[lang] || sectionTexts.en;
  const t = tRoot.events || {};

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDayKey, setSelectedDayKey] = useState("");
  const [showNextEventPopup, setShowNextEventPopup] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(EVENTS_FEED_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load events: ${response.status}`);
        }

        const data = await response.json();
        const incomingEvents = Array.isArray(data?.events) ? data.events : [];

        const filteredIncomingEvents = incomingEvents.filter((event) => {
          if (!isDisplayableStatus(event?.status)) return false;
          if (isExcludedEvent(event)) return false;
          return true;
        });

        if (!ignore) {
          setEvents(filteredIncomingEvents.map(normalizeEvent));
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || "Unable to load events.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      ignore = true;
    };
  }, []);

  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter((event) => event?.startsAtDate)
      .filter(isUpcomingEvent)
      .sort(sortByStartDateAsc);
  }, [events]);

  const nextEvent = upcomingEvents[0] || null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!nextEvent) return;

    const storageKey = `${NEXT_EVENT_POPUP_STORAGE_KEY}-${nextEvent.id}-${nextEvent.dayKey}`;
    const savedRaw = window.localStorage.getItem(storageKey);
    const now = Date.now();

    let canShow = true;

    if (savedRaw) {
      try {
        const saved = JSON.parse(savedRaw);
        const lastShownAt = Number(saved?.lastShownAt || 0);

        if (lastShownAt && now - lastShownAt < POPUP_COOLDOWN_MS) {
          canShow = false;
        }
      } catch {
        canShow = true;
      }
    }

    if (!canShow) {
      setShowNextEventPopup(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowNextEventPopup(true);

      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          eventId: nextEvent.id,
          dayKey: nextEvent.dayKey,
          lastShownAt: Date.now(),
        })
      );
    }, 700);

    return () => window.clearTimeout(timer);
  }, [nextEvent]);

  useEffect(() => {
    if (selectedEvent || showNextEventPopup) {
      document.body.classList.add("events-overlay-open");
    } else {
      document.body.classList.remove("events-overlay-open");
    }

    return () => {
      document.body.classList.remove("events-overlay-open");
    };
  }, [selectedEvent, showNextEventPopup]);

  const filteredEvents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return upcomingEvents;

    return upcomingEvents.filter((event) => {
      const haystack = [
        event.name,
        event.cleanDescription,
        event.location?.name,
        event.location?.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [searchTerm, upcomingEvents]);

  const eventsByDay = useMemo(() => {
    const map = new Map();

    filteredEvents.forEach((event) => {
      if (!event.dayKey) return;

      if (!map.has(event.dayKey)) {
        map.set(event.dayKey, []);
      }

      map.get(event.dayKey).push(event);
    });

    map.forEach((list) => list.sort(sortByStartDateAsc));
    return map;
  }, [filteredEvents]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return filteredEvents.slice(0, 8);
  }, [filteredEvents, searchTerm]);

  const monthGridDates = useMemo(
    () => getMonthGridDates(currentMonth),
    [currentMonth]
  );

  const selectedDayEvents = useMemo(() => {
    if (!selectedDayKey) return [];
    return eventsByDay.get(selectedDayKey) || [];
  }, [eventsByDay, selectedDayKey]);

  function handlePreviousMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }

  function handleNextMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }

  function openEventDetails(event, dayKey = "") {
    setSelectedEvent(event);

    if (dayKey) {
      setSelectedDayKey(dayKey);
    }

    setShowNextEventPopup(false);
  }

  function handleDayClick(date, dayEvents) {
    if (!dayEvents?.length) return;

    const dayKey = getDayKeyFromDate(date);
    setSelectedDayKey(dayKey);
    setSelectedEvent(dayEvents[0]);
  }

  function closeEventDetails() {
    setSelectedEvent(null);
  }

  function closeNextEventPopup() {
    setShowNextEventPopup(false);
  }

  return (
    <main className="page events-page" id="events">
      <section className="section-header events-header animate-fade-up">
        <div className="events-header-badge">
          {t.badge || "Church Calendar"}
        </div>

        <h2>{t.sectionTitle || "Church Services & Events"}</h2>

        <p>
          {t.sectionIntro ||
            "Stay up to date with our latest church services, worship times, and upcoming events."}
        </p>
      </section>

      <section className="events-calendar-wrap animate-fade-up">
        <div className="events-calendar-shell">
          <div className="events-calendar-topbar">
            <div className="events-calendar-topbar-copy">
              <div className="events-calendar-topbar-badge">
                {lang === "am"
                  ? "የቤተክርስቲያን ወርሃዊ መርሃ ግብር"
                  : "Monthly Church Calendar"}
              </div>

              <p className="events-calendar-topbar-text">
                {lang === "am"
                  ? "ቀኑን ይጫኑ እና የፕሮግራሙን ዝርዝር ይመልከቱ።"
                  : "Click a date to open a detailed event card. Search events quickly below."}
              </p>
            </div>

            <div className="events-calendar-search">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={
                  lang === "am"
                    ? "ፕሮግራም ይፈልጉ..."
                    : "Search services and events..."
                }
                className="events-calendar-search-input"
                aria-label={lang === "am" ? "ፕሮግራም ፈልግ" : "Search events"}
              />
            </div>
          </div>

          {loading && (
            <div className="events-state events-loading">
              {lang === "am" ? "ፕሮግራሞች በመጫን ላይ..." : "Loading events..."}
            </div>
          )}

          {!loading && error && (
            <div className="events-state events-error">
              <strong>
                {lang === "am"
                  ? "ፕሮግራሞቹን መጫን አልተቻለም።"
                  : "Unable to load events."}
              </strong>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="events-calendar-controls">
                <button
                  type="button"
                  className="events-calendar-nav"
                  onClick={handlePreviousMonth}
                  aria-label={lang === "am" ? "ያለፈው ወር" : "Previous month"}
                >
                  ‹
                </button>

                <div className="events-calendar-month-label">
                  {formatMonthYear(currentMonth, lang)}
                </div>

                <button
                  type="button"
                  className="events-calendar-nav"
                  onClick={handleNextMonth}
                  aria-label={lang === "am" ? "ቀጣዩ ወር" : "Next month"}
                >
                  ›
                </button>
              </div>

              {searchTerm.trim() && (
                <div className="events-search-results">
                  <div className="events-search-results-title">
                    {lang === "am" ? "የፍለጋ ውጤቶች" : "Search Results"}
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="events-search-results-list">
                      {searchResults.map((event) => (
                        <button
                          type="button"
                          key={`search-${event.id}`}
                          className="events-search-result-item"
                          onClick={() => {
                            const eventDate =
                              event.startsAtDate ||
                              parseDateSafe(event.starts_at);

                            if (eventDate) {
                              setCurrentMonth(
                                new Date(
                                  eventDate.getFullYear(),
                                  eventDate.getMonth(),
                                  1
                                )
                              );
                            }

                            openEventDetails(event, event.dayKey);
                          }}
                        >
                          <span className="events-search-result-name">
                            {event.name}
                          </span>

                          <span className="events-search-result-meta">
                            {formatFullDate(event.starts_at, lang)} •{" "}
                            {formatEventRange(
                              event.starts_at,
                              event.ends_at,
                              event.all_day,
                              lang
                            )}
                          </span>

                          {event.shortDescription ? (
                            <span className="events-search-result-description">
                              {event.shortDescription}
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="events-search-results-empty">
                      {lang === "am"
                        ? "ምንም ፕሮግራም አልተገኘም።"
                        : "No matching events found."}
                    </div>
                  )}
                </div>
              )}

              {!searchTerm.trim() && filteredEvents.length === 0 && (
                <div className="events-state events-empty">
                  {lang === "am"
                    ? "በአሁኑ ጊዜ የሚመጡ ፕሮግራሞች አልተገኙም።"
                    : "No upcoming events found at the moment."}
                </div>
              )}

              <div className="events-calendar-board">
                <div className="events-calendar-weekdays">
                  {monthGridDates.slice(0, 7).map((date) => (
                    <div
                      key={`weekday-${date.toISOString()}`}
                      className="events-calendar-weekday"
                    >
                      {formatWeekdayShort(date, lang)}
                    </div>
                  ))}
                </div>

                <div className="events-calendar-grid">
                  {monthGridDates.map((date) => {
                    const dayKey = getDayKeyFromDate(date);
                    const dayEvents = eventsByDay.get(dayKey) || [];
                    const isCurrentMonthDay = isSameMonth(date, currentMonth);
                    const isToday =
                      getDayKeyFromDate(date) === getDayKeyFromDate(new Date());
                    const isSelected = selectedDayKey === dayKey;

                    return (
                      <button
                        type="button"
                        key={dayKey}
                        className={[
                          "events-calendar-day",
                          isCurrentMonthDay
                            ? "events-calendar-day--current"
                            : "events-calendar-day--outside",
                          dayEvents.length
                            ? "events-calendar-day--has-events"
                            : "",
                          isToday ? "events-calendar-day--today" : "",
                          isSelected ? "events-calendar-day--selected" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() => handleDayClick(date, dayEvents)}
                        aria-label={`${formatFullDate(
                          date.toISOString(),
                          lang
                        )}${
                          dayEvents.length
                            ? ` - ${dayEvents.length} ${
                                lang === "am" ? "ፕሮግራሞች" : "events"
                              }`
                            : ""
                        }`}
                      >
                        <div className="events-calendar-day-number">
                          {date.getDate()}
                        </div>

                        <div className="events-calendar-day-events">
                          {dayEvents.slice(0, 2).map((event) => (
                            <span
                              key={`day-${dayKey}-${event.id}`}
                              className="events-calendar-event-chip"
                              onClick={(clickEvent) => {
                                clickEvent.stopPropagation();
                                openEventDetails(event, dayKey);
                              }}
                            >
                              {event.name}
                            </span>
                          ))}

                          {dayEvents.length > 2 ? (
                            <span className="events-calendar-event-more">
                              +{dayEvents.length - 2}{" "}
                              {lang === "am" ? "ተጨማሪ" : "more"}
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDayEvents.length > 0 && (
                <section className="events-selected-day-panel">
                  <div className="events-selected-day-header">
                    <div>
                      <div className="events-selected-day-badge">
                        {lang === "am" ? "የተመረጠ ቀን" : "Selected Date"}
                      </div>

                      <h3>
                        {selectedEvent?.starts_at
                          ? formatFullDate(selectedEvent.starts_at, lang)
                          : lang === "am"
                          ? "የቀኑ ፕሮግራሞች"
                          : "Events for this Day"}
                      </h3>
                    </div>
                  </div>

                  <div className="events-selected-day-list">
                    {selectedDayEvents.map((event) => (
                      <button
                        type="button"
                        key={`selected-${event.id}`}
                        className={`events-selected-day-item ${
                          selectedEvent?.id === event.id
                            ? "events-selected-day-item--active"
                            : ""
                        }`}
                        onClick={() => openEventDetails(event, selectedDayKey)}
                      >
                        <span className="events-selected-day-item-title">
                          {event.name}
                        </span>

                        <span className="events-selected-day-item-time">
                          {formatEventRange(
                            event.starts_at,
                            event.ends_at,
                            event.all_day,
                            lang
                          )}
                        </span>

                        {event.shortDescription ? (
                          <span className="events-selected-day-item-description">
                            {event.shortDescription}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </section>

      {selectedEvent && (
        <div
          className="events-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={lang === "am" ? "የፕሮግራም ዝርዝር" : "Event details"}
          onClick={closeEventDetails}
        >
          <div
            className="events-overlay-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <EventDetailsCard
              event={selectedEvent}
              lang={lang}
              onClose={closeEventDetails}
              variant="modal"
            />
          </div>
        </div>
      )}

      {showNextEventPopup && nextEvent && !selectedEvent && (
        <div
          className="events-popup-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={lang === "am" ? "ቀጣይ ፕሮግራም" : "Next event"}
          onClick={closeNextEventPopup}
        >
          <div
            className="events-popup-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="events-popup-heading">
              <div className="events-popup-badge">
                {lang === "am" ? "ቀጣይ ፕሮግራም" : "Next Event"}
              </div>
            </div>

            <EventDetailsCard
              event={nextEvent}
              lang={lang}
              onClose={closeNextEventPopup}
              variant="popup"
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default Events;
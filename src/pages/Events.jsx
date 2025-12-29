import React, { useEffect, useMemo, useState } from "react";
import "../styling/events.css";
import { useLanguage } from "../contexts/LanguageContext";
import { sectionTexts } from "../i18n/sectionTexts";
import { client } from "../sanityClient";

/* ---------------- date helpers ---------------- */
function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d, n) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function toYmd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function formatMonthTitle(date) {
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}
function formatFullDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
function formatTimeRange(startIso, endIso) {
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

    if (start.toDateString() === end.toDateString())
      return `${startTime} – ${endTime}`;
    return `${startTime} → ${endTime}`;
  } catch {
    return "";
  }
}
function daysBetween(a, b) {
  const ms = 24 * 60 * 60 * 1000;
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((end - start) / ms);
}
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/* ---------------- calendar export helpers ---------------- */
function toICSDateUTC(date) {
  // YYYYMMDDTHHMMSSZ
  const pad = (n) => String(n).padStart(2, "0");
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}
function escapeICS(text = "") {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function buildICS(ev) {
  const start = ev.startDateTime ? new Date(ev.startDateTime) : null;
  const end = ev.endDateTime ? new Date(ev.endDateTime) : null;

  // If no end time, add 1 hour default for calendar convenience
  const safeEnd =
    end || (start ? new Date(start.getTime() + 60 * 60 * 1000) : null);

  const uid = `${ev.id || ev.slug || "event"}@dght.uk`;
  const now = new Date();

  // ✅ Reminders:
  // - 1 day before
  // - 2 hours before
  const alarms = [
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeICS(
      `Reminder: ${ev.title || "Church event"} (1 day before)`
    )}`,
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeICS(
      `Reminder: ${ev.title || "Church event"} (2 hours before)`
    )}`,
    "END:VALARM",
  ];

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Debre-Genet Holy Trinity//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeICS(uid)}`,
    `DTSTAMP:${toICSDateUTC(now)}`,
    start ? `DTSTART:${toICSDateUTC(new Date(start.toISOString()))}` : "",
    safeEnd ? `DTEND:${toICSDateUTC(new Date(safeEnd.toISOString()))}` : "",
    `SUMMARY:${escapeICS(ev.title || "Church Event")}`,
    ev.location ? `LOCATION:${escapeICS(ev.location)}` : "",
    `DESCRIPTION:${escapeICS(
      [
        ev.shortSummary,
        ev.description,
        ev.address ? `Address:\n${ev.address}` : "",
        ev.mapLink ? `Map: ${ev.mapLink}` : "",
        "",
        "Reminders included:",
        "• 1 day before",
        "• 2 hours before",
      ]
        .filter(Boolean)
        .join("\n\n")
    )}`,
    ...alarms,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}

function downloadICS(ev) {
  const ics = buildICS(ev);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${(ev.title || "event")
    .replace(/[^\w]+/g, "-")
    .toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(url), 800);
}

function googleCalendarUrl(ev) {
  if (!ev.startDateTime) return "";
  const start = new Date(ev.startDateTime);
  const end = ev.endDateTime
    ? new Date(ev.endDateTime)
    : new Date(start.getTime() + 60 * 60 * 1000);

  const fmt = (d) => toICSDateUTC(new Date(d.toISOString()));
  const dates = `${fmt(start)}/${fmt(end)}`;

  const details = [
    ev.shortSummary,
    ev.description,
    ev.address ? `Address:\n${ev.address}` : "",
    ev.mapLink ? `Map: ${ev.mapLink}` : "",
    "",
    "Suggested reminders:",
    "• 1 day before",
    "• 2 hours before",
  ]
    .filter(Boolean)
    .join("\n\n");

  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", ev.title || "Church Event");
  url.searchParams.set("dates", dates);
  if (ev.location) url.searchParams.set("location", ev.location);
  if (details) url.searchParams.set("details", details);
  return url.toString();
}

/* ---------------- main component ---------------- */
function Events() {
  const { lang } = useLanguage();
  const tRoot = sectionTexts[lang] || sectionTexts.en;
  const t = tRoot.events;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calendar state
  const [monthCursor, setMonthCursor] = useState(() =>
    startOfMonth(new Date())
  );
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  // View more for month list
  const [showAllMonth, setShowAllMonth] = useState(false);

  // Reminder popup
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderEvent, setReminderEvent] = useState(null);

  // Modal details (single-page)
  const [openEvent, setOpenEvent] = useState(null);

  // responsive limit: 5 desktop / 2 mobile
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 768px)").matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // lock scroll when modal open
  useEffect(() => {
    if (!openEvent) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openEvent]);

  // close modal on ESC
  useEffect(() => {
    if (!openEvent) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeEventModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openEvent]);

  /* ✅ Close modal via browser Back button (mobile friendly) */
  useEffect(() => {
    const onPop = () => {
      const url = new URL(window.location.href);
      const eventSlug = url.searchParams.get("event");
      if (!eventSlug) setOpenEvent(null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* -------- Sanity fetch -------- */
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
        "imageUrl": mainImage.asset->url,
        "slug": slug.current
      }
    `;

    const buildFallback = () =>
      (t.upcoming || []).map((e, index) => ({
        id: e.id || `fallback-${index}`,
        title: e.title,
        shortSummary: e.description || "",
        description: e.description || "",
        location: e.location || "",
        address: e.address || "",
        mapLink: e.mapLink || "",
        imageUrl: e.imageUrl || "",
        startDateTime: null,
        endDateTime: null,
        slug: "",
      }));

    setLoading(true);

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
          shortSummary: ev.shortSummary || "",
          description: ev.description || "",
          location: ev.location || "",
          address: ev.address || "",
          mapLink: ev.mapLink || "",
          imageUrl: ev.imageUrl || "",
          startDateTime: ev.startDateTime || null,
          endDateTime: ev.endDateTime || null,
          slug: ev.slug || "",
        }));

        setEvents(mapped);

        // ✅ Select today OR next upcoming if today has none
        const now = new Date();
        const todayKey = toYmd(now);

        const hasTodayEvent = mapped.some(
          (e) => e.startDateTime && toYmd(new Date(e.startDateTime)) === todayKey
        );

        const nextUpcoming = mapped
          .filter((e) => e.startDateTime)
          .map((e) => ({ ...e, _d: new Date(e.startDateTime) }))
          .filter((e) => e._d >= now)
          .sort((a, b) => a._d - b._d)[0];

        const pick = hasTodayEvent ? now : nextUpcoming?._d || now;

        setMonthCursor(startOfMonth(pick));
        setSelectedDate(pick);
      })
      .catch((err) => {
        console.error("Error loading events from Sanity:", err);
        setEvents(buildFallback());
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  /* -------- open modal from URL param (#events?event=slug) -------- */
  useEffect(() => {
    if (loading) return;
    const url = new URL(window.location.href);
    const hash = url.hash || "";
    const eventSlug = url.searchParams.get("event");
    if (!hash.includes("events")) return;
    if (!eventSlug) return;

    const found = events.find((e) => e.slug === eventSlug);
    if (!found) return;
    setOpenEvent(found);
  }, [loading, events]);

  const openEventModal = (ev) => {
    setOpenEvent(ev);

    // keep SPA-friendly share URL
    const url = new URL(window.location.href);
    url.hash = "#events";
    if (ev?.slug) url.searchParams.set("event", ev.slug);
    window.history.pushState({}, "", url.toString());
  };

  const closeEventModal = () => {
    setOpenEvent(null);

    const url = new URL(window.location.href);
    url.searchParams.delete("event");
    url.hash = "#events";
    window.history.pushState({}, "", url.toString());
  };

  /* -------- group events by day (for calendar dots + selected list) -------- */
  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const ev of events) {
      if (!ev.startDateTime) continue;
      const key = toYmd(new Date(ev.startDateTime));
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    }
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
      map.set(k, arr);
    }
    return map;
  }, [events]);

  const selectedKey = useMemo(() => toYmd(selectedDate), [selectedDate]);

  // ✅ Selected day ALWAYS shows that day's events (even if past)
  const selectedDayEvents = useMemo(
    () => eventsByDay.get(selectedKey) || [],
    [eventsByDay, selectedKey]
  );

  /* -------- month list (future only, newest first) -------- */
  const monthEvents = useMemo(() => {
    const start = startOfMonth(monthCursor);
    const end = endOfMonth(monthCursor);

    const now = new Date();
    const todayStart = startOfDay(now);

    return events
      .filter((e) => {
        if (!e.startDateTime) return false;
        const d = new Date(e.startDateTime);
        // must be inside month
        if (d < start || d > end) return false;

        // ✅ hide past events in month list
        // (but selected day section can still show past if user clicks date)
        return d >= todayStart;
      })
      .sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime)); // newest first
  }, [events, monthCursor]);

  const monthLimit = isMobile ? 2 : 5;
  const visibleMonthEvents = showAllMonth
    ? monthEvents
    : monthEvents.slice(0, monthLimit);

  /* -------- calendar cells -------- */
  const calendarCells = useMemo(() => {
    const start = startOfMonth(monthCursor);
    const end = endOfMonth(monthCursor);

    const startWeekday = (start.getDay() + 6) % 7; // Monday first
    const daysInMonth = end.getDate();
    const cells = [];

    for (let i = 0; i < startWeekday; i++) {
      cells.push({ type: "blank", key: `b-${i}` });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        monthCursor.getFullYear(),
        monthCursor.getMonth(),
        day
      );
      const key = toYmd(date);
      const hasEvents = eventsByDay.has(key);
      const isSelected = sameDay(date, selectedDate);
      const isToday = sameDay(date, new Date());

      cells.push({
        type: "day",
        key,
        date,
        label: day,
        hasEvents,
        isSelected,
        isToday,
      });
    }

    return cells;
  }, [monthCursor, eventsByDay, selectedDate]);

  /* -------- labels -------- */
  const viewDetailsLabel = t.viewDetailsLabel || "View details";
  const shareLabel = t.shareLabel || "Share";
  const thisMonthLabel = t.thisMonthLabel || "This month";
  const selectedDayLabel = t.selectedDayLabel || "Selected day";
  const noEventsDayLabel =
    t.noEventsDayLabel || "No events scheduled for this day.";
  const viewMoreLabel = t.viewMoreLabel || "View more events";
  const viewLessLabel = t.viewLessLabel || "Show fewer events";
  const addToCalLabel = t.addToCalLabel || "Add to calendar";
  const gcalLabel = t.gcalLabel || "Google Calendar";

  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  /* -------- share helper -------- */
  const handleShare = async (ev) => {
    const shareUrl = ev?.slug
      ? `${window.location.origin}${window.location.pathname}#events?event=${ev.slug}`
      : window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: ev?.title || "Church event",
          url: shareUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied!");
    } catch (e) {
      console.warn("Share failed:", e);
    }
  };

  /* -------- reminder popup (once) -------- */
  useEffect(() => {
    if (loading) return;
    if (!events || events.length === 0) return;

    const KEY = "dght_event_reminder_v1";
    const seen = localStorage.getItem(KEY);
    if (seen === "1") return;

    const now = new Date();
    const nextUpcoming = events
      .filter((e) => e.startDateTime)
      .map((e) => ({ ...e, _d: new Date(e.startDateTime) }))
      .filter((e) => e._d >= now)
      .sort((a, b) => a._d - b._d)[0];

    if (!nextUpcoming) return;

    const diff = daysBetween(now, nextUpcoming._d);

    // show only if within 7 days
    if (diff < 0 || diff > 7) return;

    setReminderEvent(nextUpcoming);

    const timer = setTimeout(() => setReminderOpen(true), 900);
    return () => clearTimeout(timer);
  }, [loading, events]);

  const closeReminder = () => {
    try {
      localStorage.setItem("dght_event_reminder_v1", "1");
    } catch {}
    setReminderOpen(false);
  };

  const EventThumb = ({ ev }) => {
    return (
      <div className="events-thumb" aria-hidden="true">
        {ev?.imageUrl ? (
          <img src={ev.imageUrl} alt="" loading="lazy" />
        ) : (
          <div className="events-thumb-fallback">⛪</div>
        )}
        <div className="events-thumb-glow" />
      </div>
    );
  };

  const RowCalActions = ({ ev }) => {
    const gcal = googleCalendarUrl(ev);
    return (
      <div
        className="events-row-cal"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="events-row-calbtn"
          onClick={(e) => {
            e.stopPropagation();
            downloadICS(ev);
          }}
        >
          {addToCalLabel}
        </button>

        {gcal && (
          <a
            className="events-row-calbtn"
            href={gcal}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {gcalLabel}
          </a>
        )}
      </div>
    );
  };

  const EventRow = ({ ev, showDateBlock = false }) => {
    return (
      <div
        className="events-row"
        role="button"
        tabIndex={0}
        onClick={() => openEventModal(ev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openEventModal(ev);
        }}
      >
        <EventThumb ev={ev} />

        {showDateBlock && (
          <div className="events-row-date" onClick={(e) => e.stopPropagation()}>
            <div className="events-row-day">
              {ev.startDateTime
                ? new Date(ev.startDateTime).toLocaleDateString("en-GB", {
                    day: "2-digit",
                  })
                : "--"}
            </div>
            <div className="events-row-month">
              {ev.startDateTime
                ? new Date(ev.startDateTime)
                    .toLocaleDateString("en-GB", { month: "short" })
                    .toUpperCase()
                : ""}
            </div>
          </div>
        )}

        <div className="events-row-main">
          <div className="events-row-title">{ev.title}</div>

          <div className="events-row-meta">
            {ev.startDateTime && (
              <span className="events-row-time">
                {formatTimeRange(ev.startDateTime, ev.endDateTime)}
              </span>
            )}
            {ev.location && <span className="events-row-loc">{ev.location}</span>}
            {showDateBlock && ev.startDateTime && (
              <span className="events-row-fulldate">
                {formatFullDate(ev.startDateTime)}
              </span>
            )}
          </div>

          {ev.shortSummary && (
            <div className="events-row-summary">{ev.shortSummary}</div>
          )}

          <RowCalActions ev={ev} />
        </div>

        <div
          className="events-row-actions"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="events-row-link"
            onClick={(e) => {
              e.stopPropagation();
              openEventModal(ev);
            }}
          >
            {viewDetailsLabel}
          </button>

          <button
            type="button"
            className="events-row-share"
            onClick={(e) => {
              e.stopPropagation();
              handleShare(ev);
            }}
          >
            {shareLabel}
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="page events-page" id="events">
      <section className="section-header events-header animate-fade-up">
        <div className="events-header-badge">Church Calendar</div>
        <h2>{t.sectionTitle}</h2>
        <p>{t.sectionIntro}</p>
      </section>

      {loading && (
        <p className="event-loading" style={{ textAlign: "center" }}>
          Loading events from the church calendar…
        </p>
      )}

      {!loading && events.length === 0 && (
        <p className="event-empty" style={{ textAlign: "center" }}>
          No upcoming events are scheduled at the moment. Please check back soon.
        </p>
      )}

      {/* ✅ Reminder Popup */}
      {reminderOpen && reminderEvent && (
        <div
          className="event-reminder-backdrop"
          role="presentation"
          onPointerDown={closeReminder}
        >
          <div
            className="event-reminder"
            role="dialog"
            aria-modal="true"
            aria-label="Upcoming event reminder"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="event-reminder-close"
              onClick={closeReminder}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="event-reminder-badge">Upcoming</div>
            <div className="event-reminder-title">{reminderEvent.title}</div>

            <div className="event-reminder-meta">
              {reminderEvent.startDateTime && (
                <span className="event-reminder-chip">
                  {formatFullDate(reminderEvent.startDateTime)} •{" "}
                  {formatTimeRange(
                    reminderEvent.startDateTime,
                    reminderEvent.endDateTime
                  )}
                </span>
              )}
              {reminderEvent.location && (
                <span className="event-reminder-chip">
                  {reminderEvent.location}
                </span>
              )}
            </div>

            {reminderEvent.shortSummary && (
              <div className="event-reminder-summary">
                {reminderEvent.shortSummary}
              </div>
            )}

            <div className="event-reminder-actions">
              <button
                type="button"
                className="event-reminder-btn"
                onClick={() => {
                  closeReminder();
                  openEventModal(reminderEvent);
                }}
              >
                {viewDetailsLabel}
              </button>

              <button
                type="button"
                className="event-reminder-btn event-reminder-btn--primary"
                onClick={() => handleShare(reminderEvent)}
              >
                {shareLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && events.length > 0 && (
        <section className="events-calendar-wrap animate-fade-up">
          {/* Calendar Header */}
          <div className="events-calendar-header">
            <button
              type="button"
              className="events-cal-nav"
              onClick={() => setMonthCursor((d) => addMonths(d, -1))}
              aria-label="Previous month"
            >
              ←
            </button>

            <div className="events-cal-title">{formatMonthTitle(monthCursor)}</div>

            <button
              type="button"
              className="events-cal-nav"
              onClick={() => setMonthCursor((d) => addMonths(d, 1))}
              aria-label="Next month"
            >
              →
            </button>
          </div>

          {/* Weekday labels */}
          <div className="events-cal-weekdays">
            {weekdayLabels.map((w) => (
              <div key={w} className="events-cal-weekday">
                {w}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="events-cal-grid">
            {calendarCells.map((cell) => {
              if (cell.type === "blank") {
                return (
                  <div
                    key={cell.key}
                    className="events-cal-cell events-cal-cell--blank"
                  />
                );
              }

              return (
                <button
                  key={cell.key}
                  type="button"
                  className={[
                    "events-cal-cell",
                    cell.isSelected ? "is-selected" : "",
                    cell.isToday ? "is-today" : "",
                    cell.hasEvents ? "has-events" : "",
                  ].join(" ")}
                  onClick={() => setSelectedDate(cell.date)}
                >
                  <span className="events-cal-daynum">{cell.label}</span>
                  {cell.hasEvents && (
                    <span className="events-cal-dot" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected day events */}
          <div className="events-selected-day">
            <div className="events-selected-day-title">
              {selectedDayLabel}:{" "}
              <strong>
                {selectedDate.toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </strong>
            </div>

            {selectedDayEvents.length === 0 ? (
              <div className="events-selected-day-empty">{noEventsDayLabel}</div>
            ) : (
              <div className="events-list">
                {selectedDayEvents.map((ev) => (
                  <EventRow key={ev.id} ev={ev} />
                ))}
              </div>
            )}
          </div>

          {/* This month list (future only, newest first) */}
          <div className="events-month-section">
            <div className="events-month-title">{thisMonthLabel}</div>

            {monthEvents.length === 0 ? (
              <div className="events-month-empty">
                No upcoming events for this month.
              </div>
            ) : (
              <>
                <div className="events-list">
                  {visibleMonthEvents.map((ev) => (
                    <EventRow key={ev.id} ev={ev} showDateBlock />
                  ))}
                </div>

                {monthEvents.length > monthLimit && (
                  <div className="events-month-more">
                    <button
                      type="button"
                      className="events-month-more-btn"
                      onClick={() => setShowAllMonth((p) => !p)}
                    >
                      {showAllMonth ? viewLessLabel : viewMoreLabel}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ✅ Single-page Event Details Modal */}
{/* ✅ Single-page Event Details Modal */}
{openEvent && (
  <div
    className="event-modal-backdrop"
    role="presentation"
    onClick={closeEventModal}          // tap outside closes
    onDoubleClick={closeEventModal}    // ✅ double click/tap closes outside too
  >
    <div
      className="event-modal"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={closeEventModal}  // ✅ double click/tap closes inside too
    >
      {/* ✅ ZERO-SPACE overlay wrapper (sticky but height:0 => NO GAP) */}
      <div className="event-modal-close-wrap" aria-hidden="false">
        <button
          className="event-modal-close"
          type="button"
          onClick={closeEventModal}
          aria-label="Close"
          title="Close"
        >
          ✕
        </button>
      </div>

      <div className="event-modal-hero">
        {openEvent.imageUrl ? (
          <img src={openEvent.imageUrl} alt={openEvent.title} />
        ) : (
          <div className="event-modal-hero-fallback">Church Calendar</div>
        )}
      </div>

      <div className="event-modal-card">
        <div className="event-modal-badge">Church Calendar</div>
        <h3 className="event-modal-title">{openEvent.title}</h3>

        <div className="event-modal-grid">
          {openEvent.startDateTime && (
            <div className="event-modal-item">
              <strong>Date</strong>
              <span>{formatFullDate(openEvent.startDateTime)}</span>
            </div>
          )}
          {openEvent.startDateTime && (
            <div className="event-modal-item">
              <strong>Time</strong>
              <span>{formatTimeRange(openEvent.startDateTime, openEvent.endDateTime)}</span>
            </div>
          )}
          {openEvent.location && (
            <div className="event-modal-item">
              <strong>Location</strong>
              <span>{openEvent.location}</span>
            </div>
          )}
          {openEvent.address && (
            <div className="event-modal-item event-modal-address">
              <strong>Address</strong>
              <div className="event-modal-address-lines">
                {openEvent.address.split("\n").map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {openEvent.mapLink && (
          <a className="event-modal-mapcard" href={openEvent.mapLink} target="_blank" rel="noopener noreferrer">
            <div className="event-modal-mapthumb" aria-hidden="true">
              <div className="event-modal-mapicon">⛪</div>
              <div className="event-modal-mapglow" />
            </div>
            <div className="event-modal-mapmeta">
              <div className="event-modal-maptitle">View on Map</div>
              <div className="event-modal-mapsub">{openEvent.location || "Debre-Genet Holy Trinity Church"}</div>
              <div className="event-modal-mapcta">Open directions →</div>
            </div>
          </a>
        )}

        <div className="event-modal-actions">
          <button className="event-modal-btn" type="button" onClick={() => downloadICS(openEvent)}>
            {addToCalLabel}
          </button>

          {googleCalendarUrl(openEvent) && (
            <a className="event-modal-btn" href={googleCalendarUrl(openEvent)} target="_blank" rel="noopener noreferrer">
              {gcalLabel}
            </a>
          )}

          <button
            className="event-modal-btn event-modal-btn--primary"
            type="button"
            onClick={() => handleShare(openEvent)}
          >
            {shareLabel}
          </button>
        </div>

        {openEvent.shortSummary && <p className="event-modal-summary">{openEvent.shortSummary}</p>}
        {openEvent.description && <p className="event-modal-desc">{openEvent.description}</p>}
      </div>
    </div>
  </div>
)}


    </main>
  );
}

export default Events;

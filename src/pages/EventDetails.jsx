// src/pages/EventDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MembershipForm from "../components/MembershipForm";
import ContributionButton from "../components/ContributionButton";
import { client } from "../sanityClient";
import "../styling/eventDetails.css";

/* -------- ICS helpers with reminders (same as Events modal) -------- */
function toICSDateUTC(date) {
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
  const start = ev?.startDateTime ? new Date(ev.startDateTime) : null;
  const end = ev?.endDateTime ? new Date(ev.endDateTime) : null;

  const safeEnd = end || (start ? new Date(start.getTime() + 60 * 60 * 1000) : null);

  const uid = `${ev?._id || ev?.slug || "event"}@dght.uk`;
  const now = new Date();

  const desc = [ev?.shortSummary, ev?.description, ev?.address, ev?.mapLink]
    .filter(Boolean)
    .join("\n\n");

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
    `SUMMARY:${escapeICS(ev?.title || "Church Event")}`,
    ev?.location ? `LOCATION:${escapeICS(ev.location)}` : "",
    desc ? `DESCRIPTION:${escapeICS(desc)}` : "",

    // ✅ Reminder 1: 1 day before
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeICS(`Reminder: ${ev?.title || "Church Event"} (tomorrow)`)}`,
    "END:VALARM",

    // ✅ Reminder 2: 2 hours before
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeICS(`Reminder: ${ev?.title || "Church Event"} (in 2 hours)`)}`,
    "END:VALARM",

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
  a.download = `${(ev?.title || "event").replace(/[^\w]+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(url), 800);
}

/* -------- date formatting -------- */
function formatFullDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

    if (start.toDateString() === end.toDateString()) return `${startTime} – ${endTime}`;
    return `${startTime} → ${endTime}`;
  } catch {
    return "";
  }
}

export default function EventDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  const shareUrl = useMemo(() => window.location.href, []);
  const dateLabel = useMemo(() => formatFullDate(event?.startDateTime), [event?.startDateTime]);
  const timeLabel = useMemo(
    () => formatTimeRange(event?.startDateTime, event?.endDateTime),
    [event?.startDateTime, event?.endDateTime]
  );

  // ✅ Close/Exit handler: back if possible, else go to events section
  const closePage = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/#events");
  };

  // ✅ ESC closes (desktop)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closePage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      const query = `
        *[_type == "event" && isActive == true && slug.current == $slug][0]{
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

      try {
        const data = await client.fetch(query, { slug });
        if (cancelled) return;

        if (!data?._id) {
          setEvent(null);
          setLoading(false);
          return;
        }

        setEvent(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Failed to load event. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (slug) load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event?.title || "Church event",
          text: "Debre-Genet Holy Trinity Church event",
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

  return (
    <>
      <Navbar />

      <main className="event-details-page">
        {/* ✅ ALWAYS VISIBLE CLOSE BUTTON */}
        <button
          type="button"
          className="event-details-close"
          onClick={closePage}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="event-details-wrap">
          <Link className="event-details-back" to="/#events">
            ← Back to events
          </Link>

          {loading && (
            <div className="event-details-state">
              <p>Loading event…</p>
            </div>
          )}

          {!loading && error && (
            <div className="event-details-state">
              <div className="event-details-state-card">
                <h3 className="event-details-state-title">Something went wrong</h3>
                <p className="event-details-state-text">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && !event && (
            <div className="event-details-state">
              <div className="event-details-state-card">
                <h3 className="event-details-state-title">Event not found</h3>
                <p className="event-details-state-text">
                  This event may have been removed or is not active.
                </p>
              </div>
            </div>
          )}

          {!loading && !error && event && (
            <>
              <div className="event-details-hero">
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.title} />
                ) : (
                  <div className="event-details-hero-fallback">Church Calendar</div>
                )}
              </div>

              <div className="event-details-card">
                <div className="event-details-card-inner">
                  <div className="event-details-badge">Church Calendar</div>
                  <h1 className="event-details-title">{event.title}</h1>

                  <div className="event-details-grid">
                    {dateLabel && (
                      <div className="event-details-item">
                        <strong>Date</strong>
                        <span>{dateLabel}</span>
                      </div>
                    )}

                    {timeLabel && (
                      <div className="event-details-item">
                        <strong>Time</strong>
                        <span>{timeLabel}</span>
                      </div>
                    )}

                    {event.location && (
                      <div className="event-details-item">
                        <strong>Location</strong>
                        <span>{event.location}</span>
                      </div>
                    )}

                    {event.address && (
                      <div className="event-details-item event-details-address">
                        <strong>Address</strong>
                        <div className="event-details-address-lines">
                          {event.address.split("\n").map((line, idx) => (
                            <div key={idx}>{line}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {event.mapLink && (
                    <a className="event-map-card" href={event.mapLink} target="_blank" rel="noopener noreferrer">
                      <div className="event-map-thumb" aria-hidden="true">
                        {/* ✅ Matches your CSS (pin + cross overlay) */}
                        <div className="event-map-icon">
                          <span className="event-map-pin" aria-hidden="true" />
                          <span className="event-map-cross" aria-hidden="true">✚</span>
                        </div>
                        <div className="event-map-glow" />
                      </div>

                      <div className="event-map-meta">
                        <div className="event-map-title">View on Map</div>
                        <div className="event-map-sub">
                          {event.location || "Debre-Genet Holy Trinity Church"}
                        </div>
                        <div className="event-map-cta">Open directions →</div>
                      </div>
                    </a>
                  )}

                  <div className="event-details-actions">
                    {/* ✅ Extra close inside the action area (very clear on mobile) */}
                    <button type="button" className="event-details-btn" onClick={closePage}>
                      Close
                    </button>

                    {event.mapLink && (
                      <a className="event-details-btn" href={event.mapLink} target="_blank" rel="noopener noreferrer">
                        Directions
                      </a>
                    )}

                    <button
                      type="button"
                      className="event-details-btn"
                      onClick={() => downloadICS(event)}
                    >
                      Add to calendar
                    </button>

                    <button
                      type="button"
                      className="event-details-btn event-details-btn--primary"
                      onClick={handleShare}
                    >
                      Share
                    </button>
                  </div>

                  {event.shortSummary && (
                    <p className="event-details-summary">{event.shortSummary}</p>
                  )}

                  {event.description && (
                    <p className="event-details-description">{event.description}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <MembershipForm />
      <ContributionButton />
      <Footer />
    </>
  );
}

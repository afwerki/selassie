// src/pages/EventDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MembershipForm from "../components/MembershipForm";
import ContributionButton from "../components/ContributionButton";
import { client } from "../sanityClient";
import "../styling/eventDetails.css";

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

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  const shareUrl = useMemo(() => window.location.href, []);
  const dateLabel = useMemo(() => formatFullDate(event?.startDateTime), [event?.startDateTime]);
  const timeLabel = useMemo(
    () => formatTimeRange(event?.startDateTime, event?.endDateTime),
    [event?.startDateTime, event?.endDateTime]
  );

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
        <div className="event-details-wrap">
          {/* Back to homepage (top). We can later add “Back to Events” if you want */}
          <Link className="event-details-back" to="/#events">
            ← Back to events
          </Link>

          {loading && <p>Loading event…</p>}

          {!loading && error && (
            <div className="event-details-card-inner">
              <strong>{error}</strong>
            </div>
          )}

          {!loading && !error && !event && (
            <div className="event-details-card-inner">
              <h2 style={{ marginTop: 0 }}>Event not found</h2>
              <p style={{ marginBottom: 0 }}>
                This event may have been removed or is not active.
              </p>
            </div>
          )}

          {!loading && !error && event && (
            <>
              {/* Banner */}
              <div className="event-details-hero">
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.title} />
                ) : (
                  <div className="event-details-hero-fallback">Church Calendar</div>
                )}
              </div>

              {/* Invitation Card */}
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

                  {/* Map preview */}
                  {event.mapLink && (
                    <a
                      className="event-map-card"
                      href={event.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="event-map-thumb" aria-hidden="true">
                        <div className="event-map-icon">⛪</div>
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
                    {event.mapLink && (
                      <a
                        className="event-details-btn"
                        href={event.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Directions
                      </a>
                    )}

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

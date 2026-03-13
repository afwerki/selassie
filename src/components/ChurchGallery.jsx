// src/components/ChurchGallery.jsx
import React, { useEffect, useMemo, useState } from "react";

// ✅ Local images
import church1 from "../assets/images/church1.JPG";
import church7 from "../assets/images/church7.JPG";
import church19 from "../assets/images/church19.JPG";
import church10 from "../assets/images/church10.JPG";
import church12 from "../assets/images/church12.JPG";

// ✅ Each image can optionally have overlay text/subtext
const images = [
  {
    src: church1,
    title: "Abune Matias in Selassie Church",
    subtitle: "A blessed moment captured in worship",
  },
  {
    src: church7,
    // no title/subtitle = no overlay content
  },
  {
    src: church19,
    title: "Holy Trinity Wall Painting",
    subtitle: "Sacred art and heritage",
  },
  {
    src: church10,
  },
  {
    src: church12,
    title: "Prayer Gathering",
    subtitle: "Church community in unity",
  },
];

export default function ChurchGallery() {
  const loopImages = useMemo(() => [...images, ...images], []);
  const [openItem, setOpenItem] = useState(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpenItem(null);
    };

    window.addEventListener("keydown", onKeyDown);

    if (openItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openItem]);

  return (
    <section className="churchGallery">
      <style>{`
        .churchGallery {
          padding: 70px 0;
          background: #faf7f2;
          overflow: hidden;
          text-align: center;
        }

        .churchGalleryInner {
          max-width: 1150px;
          margin: 0 auto 26px;
          padding: 0 16px;
        }

        .churchGalleryTitle {
          font-size: 34px;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
          color: #1f1a17;
        }

        .churchGallerySub {
          margin: 0;
          opacity: 0.78;
          font-size: 15px;
          line-height: 1.6;
          color: #4f463f;
        }

        .trackWrap {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .trackWrap::before,
        .trackWrap::after {
          content: "";
          position: absolute;
          top: 0;
          width: 110px;
          height: 100%;
          z-index: 3;
          pointer-events: none;
        }

        .trackWrap::before {
          left: 0;
          background: linear-gradient(to right, #faf7f2, rgba(250, 247, 242, 0));
        }

        .trackWrap::after {
          right: 0;
          background: linear-gradient(to left, #faf7f2, rgba(250, 247, 242, 0));
        }

        .track {
          display: flex;
          width: fit-content;
          gap: 14px;
          padding: 8px 10px;
          will-change: transform;
          animation: galleryScroll 35s linear infinite;
        }

        .trackWrap:hover .track {
          animation-play-state: paused;
        }

        .slideBtn {
          position: relative;
          border: 0;
          background: transparent;
          padding: 0;
          cursor: pointer;
          text-align: inherit;
          min-width: 320px;
          height: 220px;
          border-radius: 18px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 12px 26px rgba(0, 0, 0, 0.12);
          transform: translateZ(0);
        }

        .slideBtn:focus-visible {
          outline: 3px solid rgba(64, 52, 42, 0.28);
          outline-offset: 3px;
        }

        .slideImg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }

        .slideBtn:hover .slideImg {
          transform: scale(1.05);
        }

        /* ✅ Glass hover overlay */
        .slideOverlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          padding: 18px;
          background:
            linear-gradient(
              to top,
              rgba(0, 0, 0, 0.45) 0%,
              rgba(0, 0, 0, 0.15) 38%,
              rgba(0, 0, 0, 0.04) 100%
            );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .slideBtn:hover .slideOverlay,
        .slideBtn:focus-visible .slideOverlay {
          opacity: 1;
        }

        .overlayCard {
          max-width: 88%;
          text-align: left;
          color: #fff;
          border-radius: 16px;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transform: translateY(8px);
          transition: transform 0.3s ease;
        }

        .slideBtn:hover .overlayCard,
        .slideBtn:focus-visible .overlayCard {
          transform: translateY(0);
        }

        .overlayTitle {
          margin: 0;
          font-size: 16px;
          line-height: 1.35;
          font-weight: 700;
          letter-spacing: 0.1px;
        }

        .overlaySub {
          margin: 6px 0 0;
          font-size: 13px;
          line-height: 1.45;
          opacity: 0.92;
        }

        @keyframes galleryScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* ✅ Lightbox */
        .lightboxOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          z-index: 9999;
        }

        .lightboxCard {
          position: relative;
          width: min(980px, 100%);
          max-height: 86vh;
          border-radius: 18px;
          overflow: hidden;
          background: rgba(20, 20, 20, 0.25);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.38);
        }

        .lightboxImg {
          width: 100%;
          height: 86vh;
          max-height: 86vh;
          object-fit: contain;
          background: rgba(0, 0, 0, 0.22);
          display: block;
        }

        .closeBtn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 42px;
          height: 42px;
          border-radius: 999px;
          border: 0;
          cursor: pointer;
          font-size: 24px;
          line-height: 42px;
          background: rgba(255, 255, 255, 0.94);
          color: #1c1c1c;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .closeBtn:focus-visible {
          outline: 3px solid rgba(255, 255, 255, 0.55);
          outline-offset: 3px;
        }

        .lightboxMeta {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 16px;
          display: flex;
          justify-content: flex-start;
          pointer-events: none;
        }

        .lightboxMetaCard {
          max-width: min(720px, 92%);
          text-align: left;
          color: #fff;
          border-radius: 16px;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .lightboxMetaTitle {
          margin: 0;
          font-size: 18px;
          line-height: 1.35;
          font-weight: 700;
        }

        .lightboxMetaSub {
          margin: 6px 0 0;
          font-size: 14px;
          line-height: 1.5;
          opacity: 0.95;
        }

        @media (max-width: 900px) {
          .slideBtn {
            min-width: 270px;
            height: 195px;
          }

          .trackWrap::before,
          .trackWrap::after {
            width: 70px;
          }

          .lightboxImg {
            height: 78vh;
            max-height: 78vh;
          }

          .overlayCard {
            max-width: 92%;
            padding: 11px 13px;
          }

          .overlayTitle {
            font-size: 15px;
          }

          .overlaySub {
            font-size: 12.5px;
          }
        }

        @media (max-width: 520px) {
          .churchGallery {
            padding: 56px 0;
          }

          .churchGalleryTitle {
            font-size: 28px;
          }

          .slideBtn {
            min-width: 220px;
            height: 170px;
            border-radius: 14px;
          }

          .track {
            animation-duration: 32s;
          }

          .trackWrap::before,
          .trackWrap::after {
            display: none;
          }

          .lightboxOverlay {
            padding: 12px;
          }

          .lightboxCard {
            border-radius: 14px;
          }

          .overlayCard {
            border-radius: 14px;
            padding: 10px 12px;
          }

          .overlayTitle {
            font-size: 14px;
          }

          .overlaySub {
            font-size: 12px;
          }

          .lightboxMeta {
            left: 12px;
            right: 12px;
            bottom: 12px;
          }

          .lightboxMetaCard {
            padding: 12px 13px;
            border-radius: 14px;
          }

          .lightboxMetaTitle {
            font-size: 16px;
          }

          .lightboxMetaSub {
            font-size: 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .track {
            animation: none;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
          }

          .slideBtn {
            scroll-snap-align: start;
          }

          .slideImg,
          .slideOverlay,
          .overlayCard {
            transition: none;
          }
        }
      `}</style>

      <div className="churchGalleryInner">
        <h2 className="churchGalleryTitle">Church Gallery</h2>
        <p className="churchGallerySub">
          Tap an image to view it bigger. Hover on images to see details where available.
        </p>
      </div>

      <div className="trackWrap" aria-label="Auto scrolling church gallery">
        <div className="track">
          {loopImages.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="slideBtn"
              onClick={() => setOpenItem(item)}
              aria-label={item.title ? `Open image: ${item.title}` : "Open image"}
            >
              <img
                className="slideImg"
                src={item.src}
                alt={item.title || "Church gallery"}
                loading="lazy"
              />

              {/* ✅ Overlay appears on hover, but text is optional */}
              <div className="slideOverlay">
                {(item.title || item.subtitle) && (
                  <div className="overlayCard">
                    {item.title && <p className="overlayTitle">{item.title}</p>}
                    {item.subtitle && <p className="overlaySub">{item.subtitle}</p>}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Lightbox */}
      {openItem && (
        <div
          className="lightboxOverlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenItem(null)}
        >
          <div className="lightboxCard" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="closeBtn"
              onClick={() => setOpenItem(null)}
              aria-label="Close image"
              title="Close"
            >
              ×
            </button>

            <img
              className="lightboxImg"
              src={openItem.src}
              alt={openItem.title || "Large church gallery view"}
            />

            {(openItem.title || openItem.subtitle) && (
              <div className="lightboxMeta">
                <div className="lightboxMetaCard">
                  {openItem.title && (
                    <p className="lightboxMetaTitle">{openItem.title}</p>
                  )}
                  {openItem.subtitle && (
                    <p className="lightboxMetaSub">{openItem.subtitle}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
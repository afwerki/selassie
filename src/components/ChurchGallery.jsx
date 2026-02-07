// src/components/ChurchGallery.jsx
import React, { useEffect, useMemo, useState } from "react";

const images = [
  "https://media.istockphoto.com/id/171393831/photo/priest-is-showing-an-ancient-book-in-ethiopia.webp?a=1&b=1&s=612x612&w=0&k=20&c=opYXjqZf-pxfvRLqXhoWtdscM-i6xo5vfYHyJZTHHJA=",
  "https://media.istockphoto.com/id/171393831/photo/priest-is-showing-an-ancient-book-in-ethiopia.webp?a=1&b=1&s=612x612&w=0&k=20&c=opYXjqZf-pxfvRLqXhoWtdscM-i6xo5vfYHyJZTHHJA=",
  "https://media.istockphoto.com/id/1472548515/photo/painting-of-the-three-persons-of-the-holy-trinity-in-debre-berhan-selassie-church-gondar.webp?a=1&b=1&s=612x612&w=0&k=20&c=u2usBU_xydbPU1wHXPqWAma_hPbmHi8ysu8pwdCX4Vw=",
];

export default function ChurchGallery() {
  const loopImages = useMemo(() => [...images, ...images], []);
  const [openSrc, setOpenSrc] = useState(null);

  // Close on ESC + prevent background scroll when modal open
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpenSrc(null);
    };

    window.addEventListener("keydown", onKeyDown);

    if (openSrc) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openSrc]);

  return (
    <section className="churchGallery">
      <style>{`
        .churchGallery{
          padding: 70px 0;
          background: #fafafa;
          overflow: hidden;
          text-align: center;
        }

        .churchGalleryInner{
          max-width: 1150px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .churchGalleryTitle{
          font-size: 34px;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }

        .churchGallerySub{
          margin: 0 0 28px;
          opacity: 0.75;
          font-size: 15px;
          line-height: 1.5;
        }

        .trackWrap{
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        /* soft fade edges */
        .trackWrap::before,
        .trackWrap::after{
          content:"";
          position:absolute;
          top:0;
          width: 110px;
          height: 100%;
          z-index: 2;
          pointer-events:none;
        }
        .trackWrap::before{
          left:0;
          background: linear-gradient(to right, #fafafa, rgba(250,250,250,0));
        }
        .trackWrap::after{
          right:0;
          background: linear-gradient(to left, #fafafa, rgba(250,250,250,0));
        }

        .track{
          display:flex;
          width: fit-content;
          gap: 14px;
          padding: 6px 10px;
          will-change: transform;
          animation: galleryScroll 35s linear infinite;
        }

        /* pause on hover */
        .trackWrap:hover .track{
          animation-play-state: paused;
        }

        .slideBtn{
          border: 0;
          background: transparent;
          padding: 0;
          cursor: pointer;
          text-align: inherit;
          min-width: 320px;
          height: 210px;
          border-radius: 16px;
          overflow:hidden;
          background: #fff;
          box-shadow: 0 10px 24px rgba(0,0,0,0.10);
          transform: translateZ(0);
        }

        .slideBtn:focus-visible{
          outline: 3px solid rgba(0,0,0,0.25);
          outline-offset: 3px;
        }

        .slideBtn img{
          width:100%;
          height:100%;
          object-fit: cover;
          display:block;
          transition: transform 0.25s ease;
        }

        .slideBtn:hover img{
          transform: scale(1.03);
        }

        @keyframes galleryScroll{
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* ✅ Modal / Lightbox */
        .lightboxOverlay{
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.68);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          z-index: 9999;
        }

        .lightboxCard{
          position: relative;
          width: min(980px, 100%);
          max-height: 85vh;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.02);
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        }

        .lightboxImg{
          width: 100%;
          height: 85vh;
          max-height: 85vh;
          object-fit: contain;
          background: rgba(0,0,0,0.2);
          display: block;
        }

        .closeBtn{
          position: absolute;
          top: 10px;
          right: 10px;
          width: 42px;
          height: 42px;
          border-radius: 999px;
          border: 0;
          cursor: pointer;
          font-size: 22px;
          line-height: 42px;
          background: rgba(255,255,255,0.92);
          box-shadow: 0 10px 20px rgba(0,0,0,0.20);
        }

        .closeBtn:focus-visible{
          outline: 3px solid rgba(255,255,255,0.5);
          outline-offset: 3px;
        }

        /* Mobile responsiveness */
        @media (max-width: 900px){
          .slideBtn{
            min-width: 260px;
            height: 190px;
          }
          .trackWrap::before,
          .trackWrap::after{
            width: 70px;
          }
          .lightboxImg{
            height: 78vh;
            max-height: 78vh;
          }
        }

        @media (max-width: 520px){
          .churchGallery{
            padding: 56px 0;
          }
          .churchGalleryTitle{
            font-size: 28px;
          }
          .slideBtn{
            min-width: 220px;
            height: 170px;
            border-radius: 14px;
          }
          .track{
            animation-duration: 32s;
          }
          .trackWrap::before,
          .trackWrap::after{
            display: none;
          }
          .lightboxOverlay{
            padding: 12px;
          }
          .lightboxCard{
            border-radius: 14px;
          }
        }

        /* Accessibility: reduce motion */
        @media (prefers-reduced-motion: reduce){
          .track{
            animation: none;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
          }
          .slideBtn{
            scroll-snap-align: start;
          }
        }
      `}</style>

      <div className="churchGalleryInner">
        <h2 className="churchGalleryTitle">Church Gallery</h2>
        <p className="churchGallerySub">
          Tap an image to view it bigger. (Hover to pause)
        </p>
      </div>

      <div className="trackWrap" aria-label="Auto scrolling church gallery">
        <div className="track">
          {loopImages.map((src, idx) => (
            <button
              key={idx}
              type="button"
              className="slideBtn"
              onClick={() => setOpenSrc(src)}
              aria-label="Open image"
            >
              <img src={src} alt="Church gallery" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Lightbox */}
      {openSrc && (
        <div
          className="lightboxOverlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenSrc(null)} // click outside to close
        >
          <div className="lightboxCard" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="closeBtn"
              onClick={() => setOpenSrc(null)}
              aria-label="Close image"
              title="Close"
            >
              ×
            </button>

            <img className="lightboxImg" src={openSrc} alt="Large view" />
          </div>
        </div>
      )}
    </section>
  );
}

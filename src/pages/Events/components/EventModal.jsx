import { useState } from "react";
import DefaultEventPoster from "./DefaultEventPoster";
import modalBgPattern from "../../../assets/events_page/model_card.jpg";

const isGoogleForm = (url) => {
  if (!url) return false;
  return url.includes("docs.google.com/forms") || url.includes("forms.gle");
};

const isMicrosoftForm = (url) => {
  if (!url) return false;
  return (
    url.includes("forms.office.com") || url.includes("forms.microsoft.com")
  );
};

const isEmbeddableForm = (url) => {
  return isGoogleForm(url) || isMicrosoftForm(url);
};

const getEmbeddableFormUrl = (url) => {
  if (!url) return "";

  if (isGoogleForm(url)) {
    if (url.includes("forms.gle")) {
      return "";
    }

    const formIdMatch = url.match(/\/forms\/d\/e\/([a-zA-Z0-9_-]+)/);

    if (formIdMatch && formIdMatch[1]) {
      const formId = formIdMatch[1];
      return `https://docs.google.com/forms/d/e/${formId}/viewform?embedded=true`;
    }

    if (url.includes("embedded=true")) {
      return url;
    }

    let cleanUrl = url.replace(/[?&]usp=dialog/, "");
    cleanUrl = cleanUrl.replace(/[?&]usp=[^&]*/, "");

    if (cleanUrl.includes("/viewform")) {
      return (
        cleanUrl +
        (cleanUrl.includes("?") ? "&embedded=true" : "?embedded=true")
      );
    }

    return cleanUrl + "/viewform?embedded=true";
  }

  if (isMicrosoftForm(url)) {
    if (url.includes("embed=true")) return url;
    return url + (url.includes("?") ? "&embed=true" : "?embed=true");
  }

  return url;
};

const canActuallyEmbed = (url) => {
  if (!url) return false;

  if (url.includes("forms.gle")) return false;
  if (url.includes("docs.google.com/forms/d/e/")) {
    const formIdMatch = url.match(/\/forms\/d\/e\/([a-zA-Z0-9_-]+)/);
    return !!formIdMatch;
  }

  if (url.includes("docs.google.com/forms")) return true;

  if (isMicrosoftForm(url)) return true;

  return false;
};

export default function EventModal({ event, onClose }) {
  const [failedPosterUrl, setFailedPosterUrl] = useState(null);
  const [showEmbeddedForm, setShowEmbeddedForm] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  if (!event) return null;

  const isImageError = failedPosterUrl === event.poster;

  const showDefaultPoster =
    !event.poster ||
    event.poster === "posters/image.png" ||
    event.poster === "" ||
    isImageError;

  const canEmbedForm = canActuallyEmbed(event.regLink);
  const embedUrl = getEmbeddableFormUrl(event.regLink);
  const formType = isMicrosoftForm(event.regLink) ? "Microsoft" : "Google";

  if (showEmbeddedForm && canEmbedForm && embedUrl) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6"
        onClick={() => setShowEmbeddedForm(false)}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0, 20, 50, 0.95) 0%, rgba(0, 5, 15, 0.98) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          className="relative w-full max-w-[900px] h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "linear-gradient(145deg, #0a1628 0%, #0d2137 100%)",
            border: "2px solid rgba(255, 215, 0, 0.3)",
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-[rgba(255,215,0,0.2)] bg-[rgba(0,20,40,0.9)] z-10">
            <h3
              className="text-base md:text-lg font-bold text-white truncate pr-4"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              Register: <span className="text-yellow-400">{event.title}</span>
              <span className="ml-2 text-xs text-cyan-400/70">
                ({formType} Form)
              </span>
            </h3>

            <div className="flex gap-2 shrink-0">
              <a
                href={event.regLink}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(100,200,255,0.1)] border border-[rgba(100,200,255,0.3)] hover:bg-[rgba(100,200,255,0.2)] transition-all"
                title="Open in new tab"
              >
                <svg
                  className="w-4 h-4 text-cyan-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>

              <button
                onClick={() => {
                  setShowEmbeddedForm(false);
                  setIsIframeLoaded(false);
                  setIframeError(false);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(255,215,0,0.15)] border border-[rgba(255,215,0,0.4)] hover:rotate-90 transition-all duration-300"
              >
                <svg
                  className="w-4 h-4 text-yellow-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative flex-1 bg-white w-full">
            {!isIframeLoaded && !iframeError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1628] z-10">
                <div className="w-10 h-10 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mb-4"></div>
                <p className="text-yellow-400/80 text-sm font-cinzel tracking-widest animate-pulse">
                  LOADING {formType.toUpperCase()} FORM...
                </p>
              </div>
            )}

            {iframeError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1628] z-10">
                <p className="text-red-400 text-sm mb-4">Failed to load form</p>
                <a
                  href={event.regLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-yellow-400 text-[#0a1628] rounded-lg font-bold"
                >
                  Open in New Tab
                </a>
              </div>
            )}

            <iframe
              src={embedUrl}
              className={`w-full h-full border-0 transition-opacity duration-500 ${
                isIframeLoaded && !iframeError ? "opacity-100" : "opacity-0"
              }`}
              title={`Registration form for ${event.title}`}
              loading="lazy"
              onLoad={() => setIsIframeLoaded(true)}
              onError={() => setIframeError(true)}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6 overflow-y-auto"
      onClick={onClose}
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(0, 20, 50, 0.9) 0%, rgba(0, 5, 15, 0.97) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(10, 22, 40, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 0, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 215, 0, 0.9);
          cursor: pointer;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 215, 0, 0.5) rgba(10, 22, 40, 0.3);
        }
      `}</style>

      <div
        className="relative w-full max-w-[1200px] my-auto rounded-3xl overflow-hidden shadow-2xl animate-modal-slide-in lg:h-[650px] flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
        style={{
          background:
            "linear-gradient(145deg, #0a1628 0%, #0d2137 50%, #0a1628 100%)",
          boxShadow:
            "0 0 80px rgba(0, 100, 200, 0.25), 0 0 120px rgba(255, 215, 0, 0.08), 0 30px 100px rgba(0, 0, 0, 0.7)",
        }}
      >
        <svg
          className="absolute top-0 left-0 w-full h-8 md:h-12 z-20 pointer-events-none"
          viewBox="0 0 1200 50"
          preserveAspectRatio="none"
        >
          <path
            d="M0 25 C50 15, 80 35, 120 30 C160 25, 180 15, 220 20 C260 25, 280 35, 320 30 C360 25, 380 10, 420 15 C460 20, 480 30, 520 28 C560 26, 580 18, 620 22 C660 26, 680 34, 720 30 C760 26, 780 14, 820 18 C860 22, 880 32, 920 28 C960 24, 980 16, 1020 20 C1060 24, 1080 30, 1120 27 C1160 24, 1180 20, 1200 25 L1200 0 L0 0 Z"
            fill="url(#topOceanWave)"
          />
          <defs>
            <linearGradient id="topOceanWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffd700" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#ffb700" stopOpacity="1" />
              <stop offset="50%" stopColor="#ffd700" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#ffaa00" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffd700" stopOpacity="0.95" />
            </linearGradient>
          </defs>
        </svg>

        <svg
          className="absolute bottom-0 left-0 w-full h-8 md:h-12 z-20 pointer-events-none"
          viewBox="0 0 1200 50"
          preserveAspectRatio="none"
        >
          <path
            d="M0 25 C40 35, 70 15, 110 20 C150 25, 170 40, 210 32 C250 24, 270 12, 310 18 C350 24, 370 38, 410 30 C450 22, 470 10, 510 16 C550 22, 570 35, 610 28 C650 21, 670 8, 710 14 C750 20, 770 36, 810 29 C850 22, 870 12, 910 18 C950 24, 970 34, 1010 28 C1050 22, 1070 14, 1110 20 C1150 26, 1170 30, 1200 25 L1200 50 L0 50 Z"
            fill="url(#bottomOceanWave)"
          />
          <defs>
            <linearGradient
              id="bottomOceanWave"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#ffd700" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#ffaa00" stopOpacity="1" />
              <stop offset="50%" stopColor="#ffd700" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#ffb700" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffd700" stopOpacity="0.95" />
            </linearGradient>
          </defs>
        </svg>

        <button
          onClick={onClose}
          className="absolute top-14 md:top-16 right-4 md:right-6 z-50 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:scale-110 cursor-pointer"
          style={{
            background: "rgba(255, 215, 0, 0.15)",
            border: "2px solid rgba(255, 215, 0, 0.4)",
          }}
        >
          <svg
            className="w-5 h-5 text-yellow-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="relative w-full lg:w-[45%] flex-shrink-0 flex items-center justify-center p-4 pt-12 md:p-6 md:pt-16 lg:p-8 lg:pt-10 bg-gradient-to-br from-[#061018] to-[#0a1a2e]">
          <div
            className="relative w-full max-w-[320px] md:max-w-[400px] rounded-2xl overflow-hidden"
            style={{
              boxShadow: showDefaultPoster
                ? "0 20px 60px rgba(0, 0, 0, 0.5)"
                : "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.12)",
              border: showDefaultPoster
                ? "none"
                : "3px solid rgba(255, 215, 0, 0.35)",
            }}
          >
            {showDefaultPoster ? (
              <DefaultEventPoster title={event.title} />
            ) : (
              <img
                src={event.poster}
                alt={event.title}
                className="w-full h-auto block"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  console.error("Poster failed to load:", event.poster);
                  e.target.style.display = "none";
                  setFailedPosterUrl(event.poster);
                }}
              />
            )}
          </div>

          <svg
            className="hidden lg:block absolute right-0 top-0 h-full w-16 z-10"
            viewBox="0 0 60 600"
            preserveAspectRatio="none"
          >
            <path
              d="M30 0 C45 25, 20 45, 35 75 C50 105, 15 125, 30 150 C45 175, 20 195, 35 225 C50 255, 15 275, 30 300 C45 325, 20 345, 35 375 C50 405, 15 425, 30 450 C45 475, 20 495, 35 525 C50 555, 15 575, 30 600"
              fill="none"
              stroke="url(#dividerOceanGold)"
              strokeWidth="4"
              opacity="0.8"
            />
            <defs>
              <linearGradient
                id="dividerOceanGold"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ffd700" stopOpacity="0.7" />
                <stop offset="33%" stopColor="#ffaa00" stopOpacity="1" />
                <stop offset="66%" stopColor="#ffd700" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffb700" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>

          <svg
            className="lg:hidden absolute bottom-0 left-0 w-full h-8 z-10"
            viewBox="0 0 400 30"
            preserveAspectRatio="none"
          >
            <path
              d="M0 15 C30 8, 50 22, 80 18 C110 14, 130 25, 160 20 C190 15, 210 8, 240 12 C270 16, 290 24, 320 18 C350 12, 370 20, 400 15 L400 30 L0 30 Z"
              fill="#0a1628"
            />
            <path
              d="M0 15 C30 8, 50 22, 80 18 C110 14, 130 25, 160 20 C190 15, 210 8, 240 12 C270 16, 290 24, 320 18 C350 12, 370 20, 400 15"
              fill="none"
              stroke="url(#mobileOceanWave)"
              strokeWidth="3"
            />
            <defs>
              <linearGradient
                id="mobileOceanWave"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#ffd700" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ffaa00" stopOpacity="1" />
                <stop offset="100%" stopColor="#ffd700" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative w-full lg:w-[55%] h-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${modalBgPattern})`,
                backgroundSize: "200px",
                backgroundRepeat: "repeat",
                clipPath:
                  "polygon(0 4%, 3% 2%, 6% 4%, 9% 1%, 12% 3%, 15% 2%, 18% 4%, 21% 1%, 24% 3%, 27% 2%, 30% 4%, 33% 1%, 36% 3%, 39% 2%, 42% 4%, 45% 1%, 48% 3%, 51% 2%, 54% 4%, 57% 1%, 60% 3%, 63% 2%, 66% 4%, 69% 1%, 72% 3%, 75% 2%, 78% 4%, 81% 1%, 84% 3%, 87% 2%, 90% 4%, 93% 1%, 96% 3%, 100% 4%, 100% 100%, 0% 100%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(10, 22, 40, 0.88) 0%, rgba(13, 33, 55, 0.85) 100%)",
                clipPath:
                  "polygon(0 4%, 3% 2%, 6% 4%, 9% 1%, 12% 3%, 15% 2%, 18% 4%, 21% 1%, 24% 3%, 27% 2%, 30% 4%, 33% 1%, 36% 3%, 39% 2%, 42% 4%, 45% 1%, 48% 3%, 51% 2%, 54% 4%, 57% 1%, 60% 3%, 63% 2%, 66% 4%, 69% 1%, 72% 3%, 75% 2%, 78% 4%, 81% 1%, 84% 3%, 87% 2%, 90% 4%, 93% 1%, 96% 3%, 100% 4%, 100% 100%, 0% 100%)",
              }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at top center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)",
              }}
            />
          </div>

          <div className="relative z-10 h-full overflow-y-auto custom-scrollbar flex flex-col gap-4 md:gap-5 p-4 pb-10 md:p-6 lg:p-10">
            <div>
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-wider m-0 pt-2"
                style={{
                  fontFamily: '"Cinzel", serif',
                  textShadow:
                    "0 0 30px rgba(255, 215, 0, 0.25), 0 4px 15px rgba(0, 0, 0, 0.5)",
                }}
              >
                {event.title}
              </h2>

              {(event.isIIITBExclusive || event.isAllThreeDays) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {event.isIIITBExclusive && (
                    <span className="px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-md bg-gradient-to-r from-amber-500/20 to-yellow-400/20 text-yellow-400 border border-yellow-400/40">
                      🎓 IIITB Exclusive
                    </span>
                  )}
                  {event.isAllThreeDays && (
                    <span className="px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-md bg-gradient-to-r from-cyan-500/20 to-blue-400/20 text-cyan-400 border border-cyan-400/40">
                      📅 All 3 Days
                    </span>
                  )}
                </div>
              )}

              <div
                className="mt-2 md:mt-3 h-1 w-16 md:w-20 rounded"
                style={{
                  background: "linear-gradient(90deg, #ffd700, transparent)",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 shrink-0">
              <div className="flex flex-col gap-1 p-3 md:p-4 rounded-xl bg-[rgba(0,40,80,0.5)] border border-[rgba(100,200,255,0.15)] border-l-[3px] border-l-[rgba(255,215,0,0.6)] transition-all duration-300 hover:bg-[rgba(0,50,100,0.6)] hover:border-l-yellow-400">
                <span className="text-[10px] md:text-xs font-semibold text-[rgba(100,200,255,0.7)] uppercase tracking-widest">
                  Date
                </span>
                <span
                  className="text-sm md:text-base font-bold text-white"
                  style={{ fontFamily: '"Cinzel", serif' }}
                >
                  {event.date}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 md:p-4 rounded-xl bg-[rgba(0,40,80,0.5)] border border-[rgba(100,200,255,0.15)] border-l-[3px] border-l-[rgba(255,215,0,0.6)] transition-all duration-300 hover:bg-[rgba(0,50,100,0.6)] hover:border-l-yellow-400">
                <span className="text-[10px] md:text-xs font-semibold text-[rgba(100,200,255,0.7)] uppercase tracking-widest">
                  Time
                </span>
                <span
                  className="text-sm md:text-base font-bold text-white"
                  style={{ fontFamily: '"Cinzel", serif' }}
                >
                  {event.time}
                </span>
              </div>
              {event.fee && (
                <div className="flex flex-col gap-1 p-3 md:p-4 rounded-xl bg-[rgba(0,40,80,0.5)] border border-[rgba(100,200,255,0.15)] border-l-[3px] border-l-[rgba(255,215,0,0.6)] transition-all duration-300 hover:bg-[rgba(0,50,100,0.6)] hover:border-l-yellow-400">
                  <span className="text-[10px] md:text-xs font-semibold text-[rgba(100,200,255,0.7)] uppercase tracking-widest">
                    Entry Fee
                  </span>
                  <span
                    className="text-sm md:text-base font-bold text-white"
                    style={{ fontFamily: '"Cinzel", serif' }}
                  >
                    {event.fee}
                  </span>
                </div>
              )}
              {event.venue && (
                <div className="flex flex-col gap-1 p-3 md:p-4 rounded-xl bg-[rgba(0,40,80,0.5)] border border-[rgba(100,200,255,0.15)] border-l-[3px] border-l-[rgba(255,215,0,0.6)] transition-all duration-300 hover:bg-[rgba(0,50,100,0.6)] hover:border-l-yellow-400">
                  <span className="text-[10px] md:text-xs font-semibold text-[rgba(100,200,255,0.7)] uppercase tracking-widest">
                    Venue
                  </span>
                  <span
                    className="text-sm md:text-base font-bold text-white"
                    style={{ fontFamily: '"Cinzel", serif' }}
                  >
                    {event.venue}
                  </span>
                </div>
              )}
            </div>

            <div
              className="relative flex items-center justify-between p-4 md:p-5 rounded-2xl overflow-hidden shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 215, 0, 0.12) 0%, rgba(255, 170, 0, 0.06) 100%)",
                border: "2px solid rgba(255, 215, 0, 0.45)",
              }}
            >
              <div className="absolute right-[15%] top-1/2 -translate-y-1/2 flex gap-2 opacity-20">
                <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                <div className="w-5 h-5 rounded-full bg-yellow-400/40 -mt-2" />
                <div className="w-2 h-2 rounded-full bg-yellow-400/60 mt-1" />
                <div className="w-4 h-4 rounded-full bg-yellow-400/30 -mt-3" />
              </div>

              <span
                className="text-yellow-400 font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] text-xs md:text-sm lg:text-base"
                style={{
                  fontFamily: '"Cinzel", serif',
                  textShadow: "0 0 20px rgba(255, 215, 0, 0.4)",
                }}
              >
                PRIZE POOL
              </span>
              <span
                className="text-yellow-400 text-xl md:text-2xl lg:text-3xl relative z-10"
                style={{
                  fontFamily: '"Titan One", sans-serif',
                  textShadow:
                    "0 0 30px rgba(255, 215, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.5)",
                }}
              >
                {event.prize}
              </span>
            </div>

            {event.description && (
              <div
                className="p-4 md:p-5 rounded-xl shrink-0 w-full"
                style={{
                  background: "rgba(0, 20, 40, 0.6)",
                  border: "1px solid rgba(255, 215, 0, 0.2)",
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.3)",
                }}
              >
                <p className="m-0 text-sm md:text-base leading-7 text-gray-100 text-justify whitespace-pre-line break-words font-medium">
                  {event.description}
                </p>
              </div>
            )}

            <div className="pt-3 md:pt-4 border-t border-[rgba(100,200,255,0.15)] shrink-0">
              <span
                className="block mb-2 md:mb-3 text-sm md:text-base font-bold text-yellow-400 tracking-widest"
                style={{ fontFamily: '"Cinzel", serif' }}
              >
                Contact:
              </span>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {event.coordinators?.map((coord, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-1 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-[rgba(0,40,80,0.5)] border border-[rgba(100,200,255,0.15)]"
                  >
                    <span className="text-sm md:text-base font-semibold text-white">
                      {coord.name}
                    </span>
                    {coord.phone && (
                      <span className="text-xs md:text-sm text-[rgba(100,200,255,0.7)]">
                        {coord.phone}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-2 md:mt-auto pt-2 md:pt-4 shrink-0 pb-4">
              {canEmbedForm ? (
                <div className="flex-1 flex gap-2">
                  <button
                    onClick={() => setShowEmbeddedForm(true)}
                    className="flex-1 flex items-center justify-center gap-2 md:gap-2.5 py-3 md:py-4 px-4 md:px-6 rounded-xl font-bold uppercase tracking-wider text-[#0a1628] transition-all duration-300 hover:-translate-y-1 text-sm md:text-base cursor-pointer"
                    style={{
                      fontFamily: '"Cinzel", serif',
                      background:
                        "linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)",
                      boxShadow:
                        "0 8px 30px rgba(255, 215, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <span>Register</span>
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M9 12h6M12 9v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                  </button>
                  <a
                    href={event.regLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center w-12 md:w-14 py-3 md:py-4 rounded-xl font-bold text-[#0a1628] transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background:
                        "linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)",
                      boxShadow:
                        "0 8px 30px rgba(255, 215, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                    }}
                    title="Open in new tab"
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                </div>
              ) : (
                <a
                  href={event.regLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 md:gap-2.5 py-3 md:py-4 px-4 md:px-6 rounded-xl font-bold uppercase tracking-wider text-[#0a1628] no-underline transition-all duration-300 hover:-translate-y-1 text-sm md:text-base"
                  style={{
                    fontFamily: '"Cinzel", serif',
                    background:
                      "linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)",
                    boxShadow:
                      "0 8px 30px rgba(255, 215, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <span>Register Now</span>
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              )}

              <a
                href={event.rulebook}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 md:gap-2.5 py-3 md:py-4 px-4 md:px-6 rounded-xl font-bold uppercase tracking-wider text-white no-underline border-2 border-[rgba(100,200,255,0.4)] bg-transparent transition-all duration-300 hover:bg-[rgba(100,200,255,0.1)] hover:border-[rgba(100,200,255,0.7)] hover:-translate-y-1 text-sm md:text-base"
                style={{ fontFamily: '"Cinzel", serif' }}
              >
                <span>Rulebook</span>
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

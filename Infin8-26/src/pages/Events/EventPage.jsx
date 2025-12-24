import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import { gsap } from "gsap";

import baseBgImg from "../../assets/events_parallax/1.png";
import surfaceImg from "../../assets/events_parallax/3.png";
import sandImg from "../../assets/events_parallax/7.png";
import defaultEventCard from "../../assets/Event_card.png";

import eventsData from "../../data/events.json";

import "./EventPage.css";

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  const posterSrc = event.poster ? event.poster : defaultEventCard;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-layout">
          <div className="modal-left">
            <div className="modal-poster-wrapper">
              <img src={posterSrc} alt={event.title} />
            </div>
          </div>

          <div className="modal-right">
            <h2 className="modal-title">{event.title}</h2>

            <div className="modal-info-grid">
              <div className="info-item">
                <span className="label">Date</span>
                <span className="value">{event.date}</span>
              </div>
              <div className="info-item">
                <span className="label">Time</span>
                <span className="value">{event.time}</span>
              </div>
              {event.fee && (
                <div className="info-item">
                  <span className="label">Entry Fee</span>
                  <span className="value">{event.fee}</span>
                </div>
              )}
            </div>

            <div className="modal-prize-box">
              <span className="prize-label">PRIZE POOL</span>
              <span className="prize-value">{event.prize}</span>
            </div>

            <div className="modal-description">
              <p>{event.description}</p>
            </div>

            <div className="modal-contacts">
              <span className="contact-title">Contact:</span>
              <div className="contact-list">
                {event.coordinators &&
                  event.coordinators.map((coord, idx) => (
                    <div key={idx} className="contact-person">
                      {coord.name} ({coord.phone})
                    </div>
                  ))}
              </div>
            </div>

            <div className="modal-actions">
              <a
                href={event.regLink}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Register Now
              </a>
              <a
                href={event.rulebook}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Rulebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LiquidBackground = lazy(() =>
  import("./components/Liquid").catch(() => ({
    default: () => <div className="layer-bg" />,
  }))
);

const lazyLoadImage = (src) => {
  const img = new Image();
  img.src = src;
  return img;
};

const DAYS_DATA = [
  { id: 1, title: "The Shallows", date: "JAN 30" },
  { id: 2, title: "The Ruins", date: "JAN 31" },
  { id: 3, title: "The Abyss", date: "FEB 1" },
];

const LazyPoster = React.memo(({ src, title, price, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0.01 }
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const img = new Image();
    img.src = src;
    img
      .decode()
      .then(() => setIsLoaded(true))
      .catch(() => setIsLoaded(true));
  }, [isInView, src]);

  return (
    <div className="event-card" onClick={onClick}>
      <div className="poster-image-wrapper" ref={wrapperRef}>
        {!isLoaded && <div className="poster-skeleton" />}
        {isLoaded && (
          <img
            className="poster-image loaded"
            src={src}
            alt={title}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      <div className="poster-content">
        <h3>{title}</h3>
        <div className="price-tag">{price}</div>
      </div>
    </div>
  );
});

LazyPoster.displayName = "LazyPoster";

export default function EventPage() {
  const scrollContainerRef = useRef(null);

  const bgObjectRef = useRef(null);
  const surfaceRef = useRef(null);
  const ruinsRef = useRef(null);
  const rocksRef = useRef(null);
  const sandRef = useRef(null);
  const plantsRef = useRef(null);

  const [activeDay, setActiveDay] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const scrollTimeoutRef = useRef(null);
  const touchStartRef = useRef(0);
  const raf = useRef(null);
  const gridRefs = useRef({});
  const previousDayRef = useRef(1);

  useEffect(() => {
    const preloadAssets = async () => {
      try {
        const [tallPlantsImg, ruinsImg, rocksImg] = await Promise.all([
          import("../../assets/events_parallax/4.png"),
          import("../../assets/events_parallax/5.png"),
          import("../../assets/events_parallax/6.png"),
        ]);
        lazyLoadImage(tallPlantsImg.default);
        lazyLoadImage(ruinsImg.default);
        lazyLoadImage(rocksImg.default);

        lazyLoadImage(baseBgImg);

        setAssetsLoaded(true);
      } catch (error) {
        console.warn("Non-critical assets failed to load:", error);
        setAssetsLoaded(true);
      }
    };
    const timer = setTimeout(preloadAssets, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let ticking = false;

    const updateParallax = () => {
      const scrollX = container.scrollLeft;

      gsap.set(surfaceRef.current, { backgroundPositionX: -scrollX * 0.1 });

      if (assetsLoaded) {
        gsap.set(ruinsRef.current, { x: -scrollX * 0.15 });
        gsap.set(rocksRef.current, { x: -scrollX * 0.15 });
        const foregroundMove = -scrollX * 0.6;
        gsap.set(sandRef.current, { x: foregroundMove });
        gsap.set(plantsRef.current, { x: foregroundMove });
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        raf.current = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [assetsLoaded]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const newDay = Number(entry.target.getAttribute("data-day"));
            if (newDay !== previousDayRef.current) {
              const prevGrid = gridRefs.current[previousDayRef.current];
              if (prevGrid) prevGrid.scrollTop = 0;
              const currentGrid = gridRefs.current[newDay];
              if (currentGrid) currentGrid.scrollTop = 0;
              setIsFocused(false);
              previousDayRef.current = newDay;
            }
            setActiveDay(newDay);
          }
        });
      },
      { threshold: 0.5 }
    );
    const panels = document.querySelectorAll(".day-panel");
    panels.forEach((p) => observer.observe(p));
    return () => observer.disconnect();
  }, []);

  const handleGridScroll = (e, dayId) => {
    if (dayId !== activeDay) return;
    const scrollTop = e.target.scrollTop;
    if (scrollTop > 40 && !isFocused) setIsFocused(true);
    if (scrollTop === 0 && isFocused) setIsFocused(false);

    if (!isScrolling) setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
  };

  const handleEventClick = (eventData) => {
    setSelectedEvent(eventData);
  };

  const handleWheel = (e, dayId) => {
    if (dayId !== activeDay) return;
    const currentGrid = gridRefs.current[dayId];
    if (!currentGrid) return;
    if (isFocused && currentGrid.scrollTop === 0 && e.deltaY < -10) {
      setIsFocused(false);
    }
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e, dayId) => {
    if (dayId !== activeDay) return;
    const currentGrid = gridRefs.current[dayId];
    if (!currentGrid || !isFocused) return;
    const touchY = e.touches[0].clientY;
    const diff = touchY - touchStartRef.current;
    if (currentGrid.scrollTop === 0 && diff > 30) {
      setIsFocused(false);
    }
  };

  const scrollToDay = (dayIndex) => {
    setIsFocused(false);
    Object.keys(gridRefs.current).forEach((key) => {
      const grid = gridRefs.current[key];
      if (grid) grid.scrollTop = 0;
    });
    scrollContainerRef.current?.scrollTo({
      left: (dayIndex - 1) * window.innerWidth,
      behavior: "smooth",
    });
  };

  const [tallPlantsImg, setTallPlantsImg] = useState(null);
  const [ruinsImg, setRuinsImg] = useState(null);
  const [rocksImg, setRocksImg] = useState(null);

  useEffect(() => {
    if (!assetsLoaded) return;
    Promise.all([
      import("../../assets/events_parallax/4.png"),
      import("../../assets/events_parallax/5.png"),
      import("../../assets/events_parallax/6.png"),
    ]).then(([plants, ruins, rocks]) => {
      setTallPlantsImg(plants.default);
      setRuinsImg(ruins.default);
      setRocksImg(rocks.default);
    });
  }, [assetsLoaded]);

  return (
    <div className="events-page-wrapper">
      <div className="parallax-background">
        <div className="layer-bg layer-bg-fallback" />

        <div className="parallax-layer layer-base">
          <img src={baseBgImg} alt="" loading="eager" />
        </div>

        <Suspense fallback={null}>
          <LiquidBackground />
        </Suspense>

        <div
          className="parallax-layer layer-surface"
          ref={surfaceRef}
          style={{ backgroundImage: `url(${surfaceImg})` }}
        />

        <div className="parallax-layer layer-sand" ref={sandRef}>
          <img src={sandImg} alt="" loading="eager" fetchpriority="high" />
          {assetsLoaded && (
            <>
              <img src={sandImg} alt="" loading="lazy" />
              <img src={sandImg} alt="" loading="lazy" />
            </>
          )}
        </div>

        {assetsLoaded && ruinsImg && (
          <div className="parallax-layer layer-ruins" ref={ruinsRef}>
            <img src={ruinsImg} alt="" loading="lazy" decoding="async" />
          </div>
        )}

        {assetsLoaded && rocksImg && (
          <div className="parallax-layer layer-rocks" ref={rocksRef}>
            <img src={rocksImg} alt="" loading="lazy" decoding="async" />
          </div>
        )}

        {assetsLoaded && tallPlantsImg && (
          <div className="parallax-layer layer-plants" ref={plantsRef}>
            <img
              src={tallPlantsImg}
              className="plant-left"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
      </div>

      <header className={`events-header ${isFocused ? "header-hidden" : ""}`}>
        <h1 className="events-title">EVENTS</h1>
        <nav className="events-timeline">
          {DAYS_DATA.map((day) => (
            <div
              key={day.id}
              className={`timeline-item ${
                activeDay === day.id ? "active" : ""
              }`}
              onClick={() => scrollToDay(day.id)}
            >
              <div
                className={`timeline-dot ${
                  activeDay === day.id ? "active" : ""
                }`}
              />
              <div className="timeline-text">
                <span className="t-day">DAY {day.id}</span>
                <span className="t-date">{day.date}</span>
              </div>
            </div>
          ))}
        </nav>
      </header>

      <div className="horizontal-scroll-wrapper" ref={scrollContainerRef}>
        {DAYS_DATA.map((day) => {
          const dayEvents = eventsData.filter((e) => e.day === day.id);

          return (
            <section
              key={day.id}
              className={`day-panel ${isFocused ? "panel-focused" : ""}`}
              data-day={day.id}
            >
              <div
                className={`day-banner-glass ${
                  isFocused ? "glass-expanded" : ""
                }`}
              >
                <div
                  ref={(el) => (gridRefs.current[day.id] = el)}
                  className={`events-grid ${isScrolling ? "is-scrolling" : ""}`}
                  onScroll={(e) => handleGridScroll(e, day.id)}
                  onWheel={(e) => handleWheel(e, day.id)}
                  onTouchStart={handleTouchStart}
                  onTouchMove={(e) => handleTouchMove(e, day.id)}
                >
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => (
                      <LazyPoster
                        key={event.id}
                        src={event.poster ? event.poster : defaultEventCard}
                        title={event.title}
                        price={`Prize: ${event.prize}`}
                        onClick={() => handleEventClick(event)}
                      />
                    ))
                  ) : (
                    <div
                      style={{
                        color: "white",
                        gridColumn: "1/-1",
                        textAlign: "center",
                        paddingTop: "50px",
                      }}
                    >
                      <h3>More events coming soon...</h3>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

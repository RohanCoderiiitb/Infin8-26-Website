import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { gsap } from "gsap";
import { useNavigate, useSearchParams } from "react-router-dom";

import baseBgImg from "../../assets/events_parallax/1.png";
import surfaceImg from "../../assets/events_parallax/3.png";
import sandImg from "../../assets/events_parallax/7.png";

import "./EventPage.css";
import { useEvents } from "./hooks/useEvents";

import EventModal from "./components/EventModal";
import EventPosterCard from "./components/EventPosterCard";

const DAYS_DATA = [
  { id: 1, date: "JAN 30" },
  { id: 2, date: "JAN 31" },
  { id: 3, date: "FEB 1" },
];

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

const EventCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-shimmer" />
    <div className="skeleton-content-box">
      <div className="skeleton-text skeleton-title" />
      <div className="skeleton-text skeleton-price" />
    </div>
  </div>
);

export default function EventPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { events: eventsData, loading: loadingEvents } = useEvents();

  const scrollContainerRef = useRef(null);
  const surfaceRef = useRef(null);
  const ruinsRef = useRef(null);
  const rocksRef = useRef(null);
  const sandRef = useRef(null);
  const plantsRef = useRef(null);
  const gridRefs = useRef({});
  const glassRefs = useRef({});

  // State
  const initialDay = parseInt(searchParams.get("day")) || 1;
  const validDay = [1, 2, 3].includes(initialDay) ? initialDay : 1;
  const [activeDay, setActiveDay] = useState(validDay);
  const [isFocused, setIsFocused] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const previousDayRef = useRef(validDay);

  const [tallPlantsImg, setTallPlantsImg] = useState(null);
  const [ruinsImg, setRuinsImg] = useState(null);
  const [rocksImg, setRocksImg] = useState(null);
  const scrollTimeoutRef = useRef(null);
  const touchStartRef = useRef(0);
  const raf = useRef(null);

  useEffect(() => {
    const preloadAssets = async () => {
      try {
        const [tallPlants, ruins, rocks] = await Promise.all([
          import("../../assets/events_parallax/4.png"),
          import("../../assets/events_parallax/5.png"),
          import("../../assets/events_parallax/6.png"),
        ]);
        lazyLoadImage(tallPlants.default);
        lazyLoadImage(ruins.default);
        lazyLoadImage(rocks.default);
        lazyLoadImage(baseBgImg);
        setAssetsLoaded(true);
      } catch {
        setAssetsLoaded(true);
      }
    };
    const timer = setTimeout(preloadAssets, 100);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const targetDay = validDay;
    const scrollLeft = (targetDay - 1) * window.innerWidth;
    scrollContainerRef.current.scrollLeft = scrollLeft;
    const timer = setTimeout(() => {
      if (scrollContainerRef.current)
        scrollContainerRef.current.scrollLeft = scrollLeft;
    }, 100);
    return () => clearTimeout(timer);
  }, [validDay]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let ticking = false;
    const easeOpacity = (t) => Math.pow(t, 1.3);

    const updateParallax = () => {
      const scrollX = container.scrollLeft;
      const vw = window.innerWidth || document.documentElement.clientWidth;

      gsap.set(surfaceRef.current, { backgroundPositionX: -scrollX * 0.1 });

      if (assetsLoaded) {
        gsap.set(ruinsRef.current, { x: -scrollX * 0.15 });
        gsap.set(rocksRef.current, { x: -scrollX * 0.15 });
        const foregroundMove = -scrollX * 0.6;
        gsap.set(sandRef.current, { x: foregroundMove });
        gsap.set(plantsRef.current, { x: foregroundMove });
      }

      const panels = document.querySelectorAll(".day-panel");
      panels.forEach((panel) => {
        const day = Number(panel.dataset.day || 0);
        const centerX = (day - 1) * vw + vw / 2;
        const dx = Math.abs(scrollX + vw / 2 - centerX);
        const normalized = Math.min(1, dx / (vw * 0.5));
        const visibleFactor = 1 - normalized;
        const opacity = Math.max(0, easeOpacity(visibleFactor));
        const yShift = (1 - visibleFactor) * 8;
        const glass = panel.querySelector(".day-banner-glass");
        if (glass) gsap.set(glass, { opacity, y: yShift });
      });
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
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
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

  const handleWheel = (e, dayId) => {
    if (dayId !== activeDay) return;
    const currentGrid = gridRefs.current[dayId];
    if (!currentGrid) return;
    if (isFocused && currentGrid.scrollTop === 0 && e.deltaY < -10)
      setIsFocused(false);
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
    if (currentGrid.scrollTop === 0 && diff > 30) setIsFocused(false);
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

  return (
    <div className="events-page-wrapper">
      <button
        onClick={() => navigate("/")}
        className="events-back-button"
        aria-label="Go back to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="events-back-icon"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </button>

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
          <img src={sandImg} alt="" loading="eager" fetchPriority="high" />
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
                ref={(el) => (glassRefs.current[day.id] = el)}
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
                  {loadingEvents ? (
                    [...Array(6)].map((_, i) => <EventCardSkeleton key={i} />)
                  ) : dayEvents.length > 0 ? (
                    dayEvents.map((event) => (
                      <EventPosterCard
                        key={event.id}
                        src={event.poster}
                        title={event.title}
                        price={`Prize: ${event.prize}`}
                        onClick={() => setSelectedEvent(event)}
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

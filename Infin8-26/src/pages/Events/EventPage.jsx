import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import { gsap } from "gsap";

import surfaceImg from "../../assets/3.png";
import sandImg from "../../assets/7.png";

import "./EventPage.css";

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
  { id: 1, title: "The Shallows", date: "JAN 12" },
  { id: 2, title: "The Ruins", date: "JAN 13" },
  { id: 3, title: "The Abyss", date: "JAN 14" },
];

const LazyPoster = React.memo(({ src, title, price }) => {
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
      {
        rootMargin: "200px",
        threshold: 0.01,
      }
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
    <div className="event-card">
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

  const surfaceRef = useRef(null);
  const ruinsRef = useRef(null);
  const rocksRef = useRef(null);
  const sandRef = useRef(null);
  const plantsRef = useRef(null);

  const [activeDay, setActiveDay] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const scrollTimeoutRef = useRef(null);
  const touchStartRef = useRef(0);
  const raf = useRef(null);
  const gridRefs = useRef({});
  const previousDayRef = useRef(1);

  useEffect(() => {
    const preloadAssets = async () => {
      try {
        const [tallPlantsImg, ruinsImg, rocksImg] = await Promise.all([
          import("../../assets/4.png"),
          import("../../assets/5.png"),
          import("../../assets/6.png"),
        ]);

        lazyLoadImage(tallPlantsImg.default);
        lazyLoadImage(ruinsImg.default);
        lazyLoadImage(rocksImg.default);

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

      gsap.set(surfaceRef.current, { x: -scrollX * 0.05 });

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
              if (prevGrid) {
                prevGrid.scrollTop = 0;
              }

              const currentGrid = gridRefs.current[newDay];
              if (currentGrid) {
                currentGrid.scrollTop = 0;
              }

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

    if (scrollTop > 40 && !isFocused) {
      setIsFocused(true);
    }

    if (scrollTop <= 10 && isFocused) {
      setIsFocused(false);
    }

    if (!isScrolling) setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
  };

  const handleWheel = (e, dayId) => {
    if (dayId !== activeDay) return;

    const currentGrid = gridRefs.current[dayId];
    if (!currentGrid) return;

    if (isFocused && currentGrid.scrollTop <= 10 && e.deltaY < 0) {
      e.preventDefault();
      setIsFocused(false);
      currentGrid.scrollTop = 0;
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

    if (currentGrid.scrollTop <= 10 && diff > 30) {
      setIsFocused(false);
      currentGrid.scrollTop = 0;
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
      import("../../assets/4.png"),
      import("../../assets/5.png"),
      import("../../assets/6.png"),
    ]).then(([plants, ruins, rocks]) => {
      setTallPlantsImg(plants.default);
      setRuinsImg(ruins.default);
      setRocksImg(rocks.default);
    });
  }, [assetsLoaded]);

  return (
    <div className="events-page-wrapper">
      {/* BACKGROUND */}
      <div className="parallax-background">
        <div className="layer-bg layer-bg-fallback" />

        <Suspense fallback={null}>
          <LiquidBackground />
        </Suspense>

        <div className="parallax-layer layer-surface" ref={surfaceRef}>
          <img src={surfaceImg} alt="" loading="eager" fetchpriority="high" />
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

        <div className="parallax-layer layer-sand" ref={sandRef}>
          <img src={sandImg} alt="" loading="eager" fetchpriority="high" />
          {assetsLoaded && (
            <>
              <img src={sandImg} alt="" loading="lazy" />
              <img src={sandImg} alt="" loading="lazy" />
            </>
          )}
        </div>

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

      {/* HEADER */}
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

      {/* HORIZONTAL SCROLL */}
      <div className="horizontal-scroll-wrapper" ref={scrollContainerRef}>
        {DAYS_DATA.map((day) => (
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
                {Array.from({ length: 10 }).map((_, i) => (
                  <LazyPoster
                    key={i}
                    src={`https://placehold.co/400x600/003344/FFF?text=Poster+${
                      i + 1
                    }`}
                    title={`Event Name ${i + 1}`}
                    price="Prize: ₹10,000"
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

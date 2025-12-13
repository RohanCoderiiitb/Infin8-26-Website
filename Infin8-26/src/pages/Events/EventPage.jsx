import React, { useEffect, useRef, useState } from "react";
import backgroundSvg from "../../assets/events.svg";
import "./EventPage.css";
import { EventCard, EventPopup } from "./EventCard";

const DAYS = [1, 2, 3];
const SNAP_THRESHOLD = 0.22;

export default function EventPage() {
  const [activeDay, setActiveDay] = useState(1);
  const scrollerRef = useRef(null);

  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const pointerState = useRef({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
  });

  const scrollToDay = (day, behavior = "smooth") => {
    const el = scrollerRef.current;
    if (!el) return;

    const slideWidth = el.clientWidth || 1;
    el.scrollTo({ left: (day - 1) * slideWidth, behavior });
    setActiveDay(day);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let t = null;

    const onScroll = () => {
      const slideWidth = el.clientWidth || 1;
      const raw = el.scrollLeft / slideWidth;
      const nearest = Math.round(raw) + 1;
      setActiveDay(Math.min(3, Math.max(1, nearest)));

      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => {
        const currentIndex = Math.floor(raw);
        const progress = raw - currentIndex;

        let targetIndex = currentIndex;
        if (progress >= SNAP_THRESHOLD) targetIndex = currentIndex + 1;

        const targetDay = Math.min(3, Math.max(1, targetIndex + 1));
        scrollToDay(targetDay, "smooth");
      }, 120);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (t) window.clearTimeout(t);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isInteractive = (target) => {
    if (!target?.closest) return false;
    return Boolean(
      target.closest(
        "button, a, input, textarea, select, [role='button'], [data-event-card]"
      )
    );
  };

  const onPointerDown = (e) => {
    if (isInteractive(e.target)) return;

    const el = scrollerRef.current;
    if (!el) return;

    pointerState.current.isDown = true;
    pointerState.current.startX = e.clientX;
    pointerState.current.startScrollLeft = el.scrollLeft;

    el.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (!pointerState.current.isDown) return;

    const dx = e.clientX - pointerState.current.startX;
    el.scrollLeft = pointerState.current.startScrollLeft - dx;
  };

  const onPointerUpOrCancel = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (!pointerState.current.isDown) return;

    pointerState.current.isDown = false;

    const slideWidth = el.clientWidth || 1;
    const raw = el.scrollLeft / slideWidth;
    const currentIndex = Math.floor(raw);
    const progress = raw - currentIndex;

    let targetIndex = currentIndex;
    if (progress >= SNAP_THRESHOLD) targetIndex = currentIndex + 1;

    const targetDay = Math.min(3, Math.max(1, targetIndex + 1));
    scrollToDay(targetDay, "smooth");

    el.releasePointerCapture?.(e.pointerId);
  };

  const openEvent = (meta) => {
    setSelectedEvent(meta);
    setPopupOpen(true);
  };

  const closeEvent = () => {
    setPopupOpen(false);
    setSelectedEvent(null);
  };

  const timelineStart = 40;
  const timelineEnd = 960;
  const progressT = (activeDay - 1) / (DAYS.length - 1);
  const progressX2 = timelineStart + (timelineEnd - timelineStart) * progressT;

  return (
    <div
      className="events-page min-h-screen w-full text-[#07324a]"
      style={{ "--events-bg": `url(${backgroundSvg})` }}
    >
      <header className="inset-x-0 top-0 z-20 bg-transparent px-4 pt-8">
        <div className="mx-auto flex w-full max-w-360 flex-col items-center gap-4 pb-4">
          <h1 className="events-title m-0 text-center text-[clamp(2.4rem,4vw,4.2rem)] font-black tracking-[0.35em] text-white">
            EVENTS
          </h1>

          <nav
            className="events-timeline w-full max-w-2xl"
            aria-label="Select event day"
          >
            <ol className="relative mx-auto flex items-start justify-between px-2 pt-2">
              <svg
                className="events-timeline-svg"
                viewBox="0 0 1000 40"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <line
                  className="events-timeline-line--base"
                  x1={timelineStart}
                  y1="20"
                  x2={timelineEnd}
                  y2="20"
                />
                {/* <line
                  className="events-timeline-line--progress"
                  x1={timelineStart}
                  y1="20"
                  x2={progressX2}
                  y2="20"
                /> */}
              </svg>

              {DAYS.map((day) => {
                const active = activeDay === day;

                return (
                  <li
                    key={day}
                    className="relative flex w-1/3 flex-col items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => scrollToDay(day)}
                      className={[
                        "group grid place-items-center",
                        "h-10 w-10 rounded-full",
                        "transition-transform duration-150 hover:-translate-y-0.5",
                        "events-node",
                        active ? "events-node--active scale-110" : "",
                      ].join(" ")}
                      aria-current={active ? "step" : undefined}
                      aria-label={`Day ${day}`}
                    >
                      <span
                        className={[
                          "block h-3 w-3 rounded-full",
                          active ? "bg-[#0b1f2a]" : "bg-[#07324a]/70",
                        ].join(" ")}
                      />
                    </button>

                    <span className="events-day-label select-none text-[12px] font-semibold uppercase tracking-[0.28em]">
                      DAY {day}
                    </span>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </header>

      <main
        ref={scrollerRef}
        className="days-scroller flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth overscroll-x-contain touch-pan-y pt-[170px]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUpOrCancel}
        onPointerCancel={onPointerUpOrCancel}
      >
        {DAYS.map((day) => (
          <section
            key={day}
            className="day-slide w-full shrink-0 snap-start px-4"
            aria-label={`Day ${day}`}
          >
            <div className="mx-auto w-full max-w-360 pb-20 pt-6">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-9">
                {Array.from({ length: 10 }).map((_, i) => (
                  <EventCard
                    key={i}
                    className="h-[640px] rounded-[18px] bg-white shadow-[0_14px_30px_rgba(0,0,0,0.16)]"
                    ariaLabel={`Open event card ${i + 1}`}
                    onClick={() => openEvent({ day, index: i })}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      <EventPopup open={popupOpen} onClose={closeEvent}></EventPopup>
    </div>
  );
}

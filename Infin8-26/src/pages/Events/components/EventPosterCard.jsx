import React, { useEffect, useRef, useState } from "react";
import vineDecoration from "../../../assets/Event_card_deco.png";
import DefaultEventPoster from "./DefaultEventPoster";

const EventPosterCard = React.memo(function EventPosterCard({
  src,
  title,
  price,
  onClick,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activated, setActivated] = useState(false);
  const [hasError, setHasError] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || activated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActivated(true);
          observer.disconnect();
        }
      },
      { rootMargin: "220px", threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [activated]);

  useEffect(() => {
    if (!activated || isLoaded || hasError) return;

    const img = new Image();
    img.src = src;

    const done = () => setIsLoaded(true);
    const error = () => setHasError(true);

    if (typeof img.decode === "function") {
      img.decode().then(done).catch(error);
    } else {
      img.onload = done;
      img.onerror = error;
    }
  }, [activated, isLoaded, hasError, src]);

  const isDefaultPoster = !src || src === "posters/image.png" || hasError;

  return (
    <div className="event-poster-card" onClick={onClick}>
      <div className="poster-image-wrapper" ref={wrapperRef}>
        {!isLoaded && !isDefaultPoster && <div className="poster-skeleton" />}

        {isDefaultPoster ? (
          <>
            <DefaultEventPoster title={title} />
            <img
              className="poster-decoration"
              src={vineDecoration}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
          </>
        ) : (
          isLoaded && (
            <>
              <img
                className="poster-image loaded"
                referrerPolicy="no-referrer"
                src={src}
                alt={title}
                loading="lazy"
                decoding="async"
              />
              <img
                className="poster-decoration"
                src={vineDecoration}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            </>
          )
        )}
      </div>
      <div className="poster-content">
        <h3>{title}</h3>
        <div className="price-tag">{price}</div>
      </div>
    </div>
  );
});

export default EventPosterCard;

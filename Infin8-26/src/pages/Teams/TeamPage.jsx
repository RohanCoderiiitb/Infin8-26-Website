import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Papa from "papaparse";
import "./TeamPage.css";
import dummyImg from "../../assets/dummy.webp";
import oceanBg from "../../assets/teams_page/background_t.jpg";
import teamDataCSV from "../../data/Team_data.csv";

gsap.registerPlugin(ScrollTrigger);

const teamImages = import.meta.glob("../../assets/teams_img/ID_*.*", {
  eager: true,
  import: "default",
});

const getTeamImage = (id) => {
  const extensions = ["png", "jpg", "jpeg", "PNG", "JPG", "JPEG"];

  for (const ext of extensions) {
    const imagePath = `../../assets/teams_img/ID_${id}.${ext}`;

    if (teamImages[imagePath]) {
      return teamImages[imagePath];
    }
  }

  return dummyImg;
};

const TeamCard = ({ member, size = "normal", preload = false }) => {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(dummyImg);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    if (preload) {
      const imageUrl = getTeamImage(member.id);
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        setImgSrc(imageUrl);
        setImgLoaded(true);
        setTimeout(() => setCardVisible(true), 50);
      };

      img.onerror = () => {
        setImgSrc(dummyImg);
        setImgLoaded(true);
        setTimeout(() => setCardVisible(true), 50);
      };

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageUrl = getTeamImage(member.id);

            const img = new Image();
            img.src = imageUrl;

            img.onload = () => {
              setImgSrc(imageUrl);
              setImgLoaded(true);
              setTimeout(() => setCardVisible(true), 50);
            };

            img.onerror = () => {
              setImgSrc(dummyImg);
              setImgLoaded(true);
              setTimeout(() => setCardVisible(true), 50);
            };

            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "100px",
        threshold: 0.01,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [member.id, preload]);

  const handlePointerMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handlePointerMove}
      className={`team-card ${size === "large" ? "team-card-large" : ""} ${
        cardVisible ? "card-visible" : "card-hidden"
      }`}
    >
      <div className="electric-container">
        <div className="border-outer-white">
          <div className="border-inner-blue"></div>
        </div>
        <div className="glow-layer-1"></div>
        <div className="glow-layer-2"></div>
      </div>

      <div className="card-overlay-1"></div>
      <div className="card-overlay-2"></div>
      <div className="card-background-glow"></div>
      <div className="card-spotlight"></div>

      <div className="card-content-wrapper">
        <div className="card-image-box">
          <img
            ref={imgRef}
            src={imgSrc}
            alt={member.name}
            className={`card-img ${!imgLoaded ? "loading" : "loaded"}`}
            loading="lazy"
          />
          <div className="card-gradient-overlay"></div>
        </div>

        <div className="card-text-box">
          <h3 className="card-member-name">{member.name}</h3>
          <p className="card-member-role">{member.role}</p>
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-link"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className="linkedin-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function TeamPage() {
  const lenisRef = useRef(null);
  const [teamData, setTeamData] = useState({
    organizers: [],
    website: [],
    designers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(teamDataCSV)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data;

            const organizers = data
              .filter((member) => member.Role === "Organizing Committee")
              .map((member) => ({
                id: member.Id,
                name: member.Name1,
                role: "Organizing Committee",
                linkedin: member["linkedin profile url"] || "",
              }));

            const website = data
              .filter((member) => member.Role === "Website")
              .map((member) => ({
                id: member.Id,
                name: member.Name1,
                role: "Website",
                linkedin: member["linkedin profile url"] || "",
              }));

            const designers = data
              .filter((member) => member.Role === "Design")
              .map((member) => ({
                id: member.Id,
                name: member.Name1,
                role: "Design",
                linkedin: member["linkedin profile url"] || "",
              }));

            setTeamData({ organizers, website, designers });
            setLoading(false);
          },
        });
      });
  }, []);

  useEffect(() => {
    if (loading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: true,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".vertical-divider").forEach((line, i) => {
        gsap.from(line, {
          scaleY: 0,
          duration: 1.5,
          ease: "power3.out",
          delay: i * 0.15,
        });
      });

      const gridWrapper = document.querySelector(".team-grid-wrapper");
      const desktopGrid = document.querySelector(".desktop-grid");
      const websiteContainer = document.querySelector(
        ".team-column-left .team-cards-container"
      );
      const designersContainer = document.querySelector(
        ".team-column-right .team-cards-container"
      );
      const organizersContainer = document.querySelector(
        ".team-column-middle .team-cards-container"
      );

      if (!gridWrapper || !desktopGrid) return;

      const viewportHeight = window.innerHeight;
      const scrollDistance = 5200;

      gridWrapper.style.minHeight = `${viewportHeight + scrollDistance}px`;

      ScrollTrigger.create({
        trigger: gridWrapper,
        start: "top top",
        end: `+=${scrollDistance}`,
        pin: desktopGrid,
        pinSpacing: true,
      });

      gsap.to(websiteContainer, {
        y: -1800,
        ease: "none",
        scrollTrigger: {
          trigger: gridWrapper,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: 1.5,
        },
      });

      gsap.to(designersContainer, {
        y: -2700,
        ease: "none",
        scrollTrigger: {
          trigger: gridWrapper,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: 1.2,
        },
      });

      gsap.to(organizersContainer, {
        y: -5000,
        ease: "none",
        scrollTrigger: {
          trigger: gridWrapper,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: 1,
        },
      });

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center">
        <div className="text-2xl text-[#001148] font-bold">Loading team...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <svg className="svg-filters"></svg>

      <div className="fixed inset-0 z-0">
        <img
          src={oceanBg}
          alt="Ocean Background"
          className="w-full h-full object-cover brightness-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#b3d9e8]/20 via-[#4a9ec1]/10 to-[#1a5c7a]/40"></div>
        <div className="light-rays">
          <div className="light-ray ray-1"></div>
          <div className="light-ray ray-2"></div>
          <div className="light-ray ray-3"></div>
        </div>
      </div>

      <div className="fixed inset-0 z-1 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <button
  onClick={() => window.history.back()}
  className="back-button"
  aria-label="Go back"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="back-button-icon"
  >
    <path d="m12 19-7-7 7-7"></path>
    <path d="M19 12H5"></path>
  </svg>
</button>
        <header className="team-header-static">
          <h1 className="main-title">MEET OUR TEAM</h1>
          <div className="title-underline"></div>
        </header>

        <div className="team-grid-wrapper">
          <div className="desktop-grid">
            <div className="team-column team-column-left">
              <div className="vertical-divider"></div>
              <div className="column-label">WEBSITE</div>
              <div className="team-cards-container">
                {teamData.website.map((member, index) => (
                  <TeamCard
                    key={member.id}
                    member={member}
                    preload={index < 2}
                  />
                ))}
              </div>
            </div>

            <div className="team-column team-column-middle">
              <div className="vertical-divider vertical-divider-center"></div>
              <div className="column-label column-label-center">ORGANIZERS</div>
              <div className="team-cards-container">
                {teamData.organizers.map((member, index) => (
                  <TeamCard
                    key={member.id}
                    member={member}
                    size="large"
                    preload={index < 2}
                  />
                ))}
              </div>
            </div>

            <div className="team-column team-column-right">
              <div className="vertical-divider"></div>
              <div className="column-label">DESIGNERS</div>
              <div className="team-cards-container">
                {teamData.designers.map((member, index) => (
                  <TeamCard
                    key={member.id}
                    member={member}
                    preload={index < 2}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mobile-grid">
          <section className="mobile-section">
            <h2 className="mobile-title">ORGANIZERS</h2>
            <div className="mobile-cards">
              {teamData.organizers.map((member, index) => (
                <TeamCard key={member.id} member={member} preload={index < 2} />
              ))}
            </div>
          </section>

          <section className="mobile-section">
            <h2 className="mobile-title">WEBSITE</h2>
            <div className="mobile-cards">
              {teamData.website.map((member, index) => (
                <TeamCard key={member.id} member={member} preload={index < 2} />
              ))}
            </div>
          </section>

          <section className="mobile-section">
            <h2 className="mobile-title">DESIGNERS</h2>
            <div className="mobile-cards">
              {teamData.designers.map((member, index) => (
                <TeamCard key={member.id} member={member} preload={index < 2} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

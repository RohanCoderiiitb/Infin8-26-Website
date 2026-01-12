import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import Lenis from "lenis";
import Papa from "papaparse";
import "./TeamPage.css";
import dummyImg from "../../assets/dummy.webp";
import oceanBg from "../../assets/teams_page/background_t.jpg";
import teamDataCSV from "../../data/Team_data.csv";

gsap.registerPlugin(ScrollTrigger);

const teamImagesHi = import.meta.glob("../../assets/teams_img/ID_*.*", {
  eager: true,
  import: "default",
});

const teamImagesLo = import.meta.glob("../../assets/teams_img/ID_*.*", {
  eager: true,
  import: "default",
  query: "?w=240&format=webp&quality=35",
});

const getImageMaps = () => {
  const hiMap = new Map();
  const loMap = new Map();

  for (const path of Object.keys(teamImagesHi)) {
    const match = path.match(/ID_(\d+)\./);
    if (match) {
      const id = match[1];
      if (!hiMap.has(id)) hiMap.set(id, teamImagesHi[path]);
    }
  }

  for (const path of Object.keys(teamImagesLo)) {
    const match = path.match(/ID_(\d+)\./);
    if (match) {
      const id = match[1];
      if (!loMap.has(id)) loMap.set(id, teamImagesLo[path]);
    }
  }

  return { hiMap, loMap };
};

const { hiMap, loMap } = getImageMaps();

const getTeamImage = (id, variant = "hi") => {
  const map = variant === "lo" ? loMap : hiMap;
  return map.get(String(id)) || dummyImg;
};

const __decodePromiseCache = new Map();
const __decodedSet = new Set();

const decodeImage = (url) => {
  if (!url || url === dummyImg) return Promise.resolve(url);
  if (__decodedSet.has(url)) return Promise.resolve(url);
  const cached = __decodePromiseCache.get(url);
  if (cached) return cached;

  const p = new Promise((resolve) => {
    const img = new Image();
    img.src = url;

    const done = () => {
      __decodedSet.add(url);
      __decodePromiseCache.set(url, Promise.resolve(url));
      resolve(url);
    };

    if (typeof img.decode === "function") {
      img.decode().then(done).catch(done);
    } else {
      img.onload = done;
      img.onerror = done;
    }
  });

  __decodePromiseCache.set(url, p);
  return p;
};

const preloadWithPriority = async (
  urls,
  priorityCount = 8,
  concurrency = 4
) => {
  const list = Array.from(new Set(urls.filter(Boolean)));
  const priority = list.slice(0, priorityCount);
  const rest = list.slice(priorityCount);

  const runWithConcurrency = async (batch) => {
    let i = 0;
    const workers = Array.from(
      { length: Math.min(concurrency, batch.length) },
      async () => {
        while (i < batch.length) {
          const url = batch[i++];
          await decodeImage(url);
        }
      }
    );
    await Promise.all(workers);
  };

  await runWithConcurrency(priority);

  if (rest.length > 0) {
    const run = () => runWithConcurrency(rest).catch(() => {});
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 2500 });
    } else {
      setTimeout(run, 80);
    }
  }
};

const normalizeMember = (m, role) => ({
  id: (m.Id ?? "").trim(),
  name: (m.Name1 ?? "").trim(),
  role,
  linkedin: (m["linkedin profile url"] ?? "").trim(),
});

const TeamCard = ({ member, size = "normal", isPriority = false }) => {
  const cardRef = useRef(null);
  const rafMoveRef = useRef(0);
  const lastEvtRef = useRef(null);

  const loSrc = useMemo(() => getTeamImage(member.id, "lo"), [member.id]);
  const hiSrc = useMemo(() => getTeamImage(member.id, "hi"), [member.id]);

  const [activated, setActivated] = useState(isPriority);
  const [loLoaded, setLoLoaded] = useState(false);
  const [hiDecoded, setHiDecoded] = useState(__decodedSet.has(hiSrc));
  const [loError, setLoError] = useState(false);
  const [hiError, setHiError] = useState(false);

  useEffect(() => {
    if (activated) return;

    const el = cardRef.current;
    if (!el) return;

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
    if (!activated) return;
    if (!hiSrc || hiSrc === dummyImg) return;
    if (hiDecoded) return;

    let cancelled = false;
    decodeImage(hiSrc).then(() => {
      if (!cancelled) setHiDecoded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [activated, hiSrc, hiDecoded]);

  useEffect(() => {
    return () => {
      if (rafMoveRef.current) cancelAnimationFrame(rafMoveRef.current);
    };
  }, []);

  const applyPointer = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  };

  const handlePointerMove = (e) => {
    lastEvtRef.current = e;
    if (rafMoveRef.current) return;
    rafMoveRef.current = requestAnimationFrame(() => {
      rafMoveRef.current = 0;
      if (lastEvtRef.current) applyPointer(lastEvtRef.current);
    });
  };

  const buildMissingBoth = loSrc === dummyImg && hiSrc === dummyImg;
  const runtimeFailedBoth =
    (loSrc === dummyImg || loError) && (hiSrc === dummyImg || hiError);
  const showDummy = buildMissingBoth || runtimeFailedBoth;

  const showSkeleton =
    activated &&
    !showDummy &&
    !hiDecoded &&
    !(loLoaded && !loError) &&
    !(hiError && loLoaded && !loError);

  return (
    <div
      ref={cardRef}
      onMouseMove={handlePointerMove}
      className={`team-card ${size === "large" ? "team-card-large" : ""} ${
        activated ? "card-visible" : "card-hidden"
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
          {showSkeleton && (
            <div className="card-skeleton-wrapper" aria-hidden="true">
              <div className="card-skeleton"></div>
            </div>
          )}

          {activated && !showDummy && (
            <>
              {loSrc !== dummyImg && !loError && (
                <img
                  src={loSrc}
                  alt=""
                  aria-hidden="true"
                  className="card-img card-img-lo"
                  loading={isPriority ? "eager" : "lazy"}
                  fetchpriority={isPriority ? "high" : "auto"}
                  decoding="async"
                  onLoad={() => setLoLoaded(true)}
                  onError={() => setLoError(true)}
                />
              )}

              {hiSrc !== dummyImg && !hiError && (
                <img
                  src={hiSrc}
                  alt={member.name}
                  className={`card-img card-img-hi ${
                    hiDecoded ? "is-loaded" : ""
                  }`}
                  loading={isPriority ? "eager" : "lazy"}
                  fetchpriority={isPriority ? "high" : "auto"}
                  decoding="async"
                  onError={() => setHiError(true)}
                />
              )}
            </>
          )}

          {activated && showDummy && (
            <img
              src={dummyImg}
              alt={member.name}
              className="card-img card-img-hi is-loaded"
              loading="lazy"
              decoding="async"
            />
          )}

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
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Events", path: "/events" },
    { label: "Team", path: "/teams" },
  ];
  const [dataReady, setDataReady] = useState(false);

  const [particles] = useState(() => {
    const count = 10;
    return Array.from({ length: count }, () => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${16 + Math.random() * 10}s`,
    }));
  });

  useEffect(() => {
    const controller = new AbortController();

    fetch(teamDataCSV, { signal: controller.signal })
      .then((r) => r.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = Array.isArray(results.data) ? results.data : [];

            const organizers = data
              .filter((m) => (m.Role ?? "").trim() === "Organizing Committee")
              .map((m) => normalizeMember(m, "Organizing Committee"))
              .filter((m) => m.id && m.name);

            const website = data
              .filter((m) => (m.Role ?? "").trim() === "Website")
              .map((m) => normalizeMember(m, "Website"))
              .filter((m) => m.id && m.name);

            const designers = data
              .filter((m) => (m.Role ?? "").trim() === "Design")
              .map((m) => normalizeMember(m, "Design"))
              .filter((m) => m.id && m.name);

            setTeamData({ organizers, website, designers });
            setDataReady(true);
          },
        });
      })
      .catch(() => {
        setTeamData({ organizers: [], website: [], designers: [] });
        setDataReady(true);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!dataReady) return;

    const allIds = [
      ...teamData.organizers.map((m) => m.id),
      ...teamData.website.map((m) => m.id),
      ...teamData.designers.map((m) => m.id),
    ];

    const hiUrls = allIds.map((id) => getTeamImage(id, "hi"));
    preloadWithPriority(hiUrls, 8, 4);
  }, [dataReady, teamData]);

  useEffect(() => {
    if (!dataReady) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1201px)", () => {
      const lenis = new Lenis({
        duration: 1.1,
        smooth: true,
        smoothTouch: false,
      });
      lenisRef.current = lenis;

      const tick = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);

      const ctx = gsap.context(() => {
        gsap.utils.toArray(".vertical-divider").forEach((line, i) => {
          gsap.from(line, {
            scaleY: 0,
            duration: 1.3,
            ease: "power3.out",
            delay: i * 0.12,
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
        const scrollDistance = 4500;

        gridWrapper.style.minHeight = `${viewportHeight + scrollDistance}px`;

        ScrollTrigger.create({
          trigger: gridWrapper,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: desktopGrid,
          pinSpacing: true,
        });

        if (websiteContainer) {
          gsap.to(websiteContainer, {
            y: -2150,
            ease: "none",
            scrollTrigger: {
              trigger: gridWrapper,
              start: "top top",
              end: `+=${scrollDistance}`,
              scrub: 1.5,
            },
          });
        }

        if (designersContainer) {
          gsap.to(designersContainer, {
            y: -3000,
            ease: "none",
            scrollTrigger: {
              trigger: gridWrapper,
              start: "top top",
              end: `+=${scrollDistance}`,
              scrub: 1.2,
            },
          });
        }

        if (organizersContainer) {
          gsap.to(organizersContainer, {
            y: -5200,
            ease: "none",
            scrollTrigger: {
              trigger: gridWrapper,
              start: "top top",
              end: `+=${scrollDistance}`,
              scrub: 1,
            },
          });
        }

        ScrollTrigger.refresh();
      });

      return () => {
        ctx.revert();
        lenis.destroy();
        lenisRef.current = null;
        gsap.ticker.remove(tick);
        ScrollTrigger.getAll().forEach((t) => t.kill());
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      };
    });

    return () => {
      mm.revert();
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [dataReady]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <svg className="svg-filters"></svg>

      <div className="fixed inset-0 z-0">
        <img
          src={oceanBg}
          alt="Ocean Background"
          className="w-full h-full object-cover brightness-125"
          loading="eager"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#b3d9e8]/20 via-[#4a9ec1]/10 to-[#1a5c7a]/40"></div>
        <div className="light-rays">
          <div className="light-ray ray-1"></div>
          <div className="light-ray ray-2"></div>
          <div className="light-ray ray-3"></div>
        </div>
      </div>

      <div className="fixed inset-0 z-1 pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: p.left,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
            }}
          />
        ))}
      </div>
      <button onClick={() => setOpen(true)} className="team-hamburger-btn">
        <Menu size={36} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="sidebar"
          >
            <button onClick={() => setOpen(false)} className="close-btn">
              <X size={28} />
            </button>

            <nav className="sidebar-nav">
              {menuItems.map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.1, x: -10 }}
                  className="nav-item"
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                >
                  {item.label.toUpperCase()}
                </motion.button>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

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
                  isPriority={index < 3}
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
                  isPriority={index < 3}
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
                  isPriority={index < 3}
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
              <TeamCard
                key={member.id}
                member={member}
                isPriority={index < 2}
              />
            ))}
          </div>
        </section>

        <section className="mobile-section">
          <h2 className="mobile-title">WEBSITE</h2>
          <div className="mobile-cards">
            {teamData.website.map((member, index) => (
              <TeamCard
                key={member.id}
                member={member}
                isPriority={index < 2}
              />
            ))}
          </div>
        </section>

        <section className="mobile-section">
          <h2 className="mobile-title">DESIGNERS</h2>
          <div className="mobile-cards">
            {teamData.designers.map((member, index) => (
              <TeamCard
                key={member.id}
                member={member}
                isPriority={index < 2}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

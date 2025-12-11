import React, { useRef, useState, useEffect } from "react";
import dummyAvatar from "../../assets/dummy.webp";
import "./TeamPage.css";

const teamData = {
  organizing: [
    { name: "Person-1", role: "Role-1", img: dummyAvatar, linkedin: "#" },
    { name: "Person-2", role: "Role-2", img: dummyAvatar, linkedin: "#" },
    { name: "Person-3", role: "Role-3", img: dummyAvatar, linkedin: "#" },
  ],
  design: [
    { name: "Person-4", role: "Role-4", img: dummyAvatar, linkedin: "#" },
    {
      name: "Person-5",
      role: "Role-5",
      img: dummyAvatar,
      linkedin: "#",
    },
    { name: "Person-6", role: "Role-6", img: dummyAvatar, linkedin: "#" },
  ],
  website: [
    { name: "Person-7", role: "Role-7", img: dummyAvatar, linkedin: "#" },
    { name: "Person-8", role: "Role-8", img: dummyAvatar, linkedin: "#" },
    { name: "Person-9", role: "Role-9", img: dummyAvatar, linkedin: "#" },
  ],
};

const sections = [
  { key: "organizing", label: "Organizing" },
  { key: "design", label: "Design" },
  { key: "website", label: "Website" },
];

const TeamPage = () => {
  const sectionRefs = useRef({});
  const scrollContainerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [triangles, setTriangles] = useState([]);
  const [activeSection, setActiveSection] = useState("organizing");

  //Under-progress effect
  useEffect(() => {
    const trianglesData = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 120 + 80,
      rotation: Math.random() * 360,
    }));
    setTriangles(trianglesData);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const containerWidth = scrollContainer.offsetWidth;
      const currentIndex = Math.round(scrollLeft / containerWidth);

      if (sections[currentIndex]) {
        setActiveSection(sections[currentIndex].key);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (key) => {
    sectionRefs.current[key]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
    });
    setActiveSection(key);
  };

  return (
    <div className="team-page">
      {/* <div className="triangles-layer">
        {triangles.map((t) => (
          <div
            key={t.id}
            className="triangle"
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              width: t.size,
              height: t.size,
              transform: `translate(calc(-50% + ${
                mousePos.x * 60
              }px), calc(-50% + ${mousePos.y * 60}px)) rotate(${
                t.rotation + mousePos.x * 20
              }deg)`,
            }}
          />
        ))}
      </div> */}

      <div className="bg-base" aria-hidden />

      <div className="top-bar">
        <h1 className="page-title">Meet our Team</h1>
        <nav className="nav-pills">
          {sections.map(({ key, label }) => (
            <button
              key={key}
              className={`nav-pill ${activeSection === key ? "active" : ""}`}
              onClick={() => scrollTo(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="h-scroll" ref={scrollContainerRef}>
        {sections.map(({ key, label }) => (
          <section
            key={key}
            ref={(el) => (sectionRefs.current[key] = el)}
            className="team-section"
          >
            <div className="section-header">
              <h2>{label} Team</h2>
            </div>
            <div className="cards">
              {teamData[key].map((member, memberIdx) => (
                <a
                  key={member.name}
                  className="card"
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    "--delay": `${memberIdx * 0.1}s`,
                  }}
                >
                  <div className="card-bg">
                    <img src={member.img} alt={member.name} />
                    <div className="card-overlay" />
                  </div>
                  <div className="card-label">
                    <h3>{member.name}</h3>
                    <span>{member.role}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;

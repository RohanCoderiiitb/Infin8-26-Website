import React, { useEffect, useRef, useState } from "react";
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
    { name: "Person-5", role: "Role-5", img: dummyAvatar, linkedin: "#" },
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

export default function TeamPage() {
  const sectionRefs = useRef({});
  const scrollRef = useRef(null);
  const [activeSection, setActiveSection] = useState(sections[0].key);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const w = el.clientWidth || 1;
      const idx = Math.round(el.scrollLeft / w);
      const next = sections[idx]?.key;
      if (next) setActiveSection(next);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (key) => {
    sectionRefs.current[key]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
    });
    setActiveSection(key);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-gray-100 text-gray-900">
      <div
        aria-hidden
        className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,220,220,0.45),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(200,200,200,0.35),transparent_35%),linear-gradient(180deg,#fafafa,#f0f0f0)]"
      />

      <header className="fixed inset-x-0 top-0 z-10 h-22.5 border-b border-black/10 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-2 px-4">
          <h1 className="m-0 text-[24px] font-semibold tracking-wide">
            Meet our Team
          </h1>

          <nav className="flex items-center gap-6">
            {sections.map(({ key, label }) => {
              const active = activeSection === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => scrollTo(key)}
                  className={[
                    "relative cursor-pointer bg-transparent px-0 py-1 text-[14px] font-medium uppercase tracking-widest",
                    active
                      ? "text-gray-900"
                      : "text-black/60 hover:text-gray-900",
                    "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gray-900 after:transition-[width] after:duration-300",
                    active ? "after:w-full" : "after:w-0 hover:after:w-full",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main
        ref={scrollRef}
        className="team-hscroll relative z-1 mt-22.5 grid h-[calc(100vh-90px)] grid-flow-col auto-cols-[100vw] overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory"
      >
        {sections.map(({ key, label }) => (
          <section
            key={key}
            ref={(el) => (sectionRefs.current[key] = el)}
            className="team-section snap-start px-7 py-10"
            aria-label={`${label} Team`}
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-7">
              <div>
                <h2 className="m-0 text-[32px] font-semibold tracking-wide">
                  {label} Team
                </h2>
              </div>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
                {teamData[key].map((member) => (
                  <a
                    key={member.name}
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative h-75 overflow-hidden rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)]"
                  >
                    <img
                      src={member.img}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
                    />

                    <div className="absolute inset-0 bg-linear-to-b from-black/10 to-black/55" />

                    <div className="absolute inset-x-0 bottom-0 z-1 p-5">
                      <h3 className="m-0 text-[20px] font-semibold text-white">
                        {member.name}
                      </h3>
                      <span className="mt-1 block text-[12px] font-medium uppercase tracking-[1.2px] text-white/85">
                        {member.role}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

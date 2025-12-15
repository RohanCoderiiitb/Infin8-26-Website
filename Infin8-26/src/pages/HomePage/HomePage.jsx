import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FaqSection from "../../components/FaqSection/FaqSection";
import "./HomePage.css";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Events", path: "/events" },
    { label: "Team", path: "/teams" },
    { label: "Sponsors", path: "/sponsors" },
  ];

  return (
    <div className="home-wrapper">

      <section className="hero-section">
        <h1 className="hero-title">INFIN8 2026</h1>

        <button onClick={() => setOpen(true)} className="hamburger-btn">
          <Menu size={36} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
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
      </section>

      <section className="events-section">
        <div className="events-content">
          <h2 className="section-title">EVENTS</h2>

          <p className="events-text">
            From heart-thumping dance battles and soulful musical performances
            to intense gaming showdowns and quirky quizzes, Infin8’s events are
            a treasure trove of opportunities to shine. Dive in, compete, and
            experience the thrill of creating memories that last a lifetime.
          </p>

          <div className="event-days">
            <div
              className="event-card"
              onClick={() => navigate("/events?day=1")}
              role="button"
            >
              E1
              <span>Day 1</span>
            </div>

            <div
              className="event-card"
              onClick={() => navigate("/events?day=2")}
              role="button"
            >
              E2
              <span>Day 2</span>
            </div>

            <div
              className="event-card"
              onClick={() => navigate("/events?day=3")}
              role="button"
            >
              E3
              <span>Day 3</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2 className="section-title dark">ABOUT INFIN8</h2>
        <p className="about-text">
          Infin8, the yearly cultural bash at IIITB, is a three-day extravaganza
          filled with vibrant shows, performances, competitions, games, and
          stalls. A unique and exciting experience for everyone.
          <br /><br />
          Talented artists from all corners of India come to showcase their
          skills, turning it into a thrilling spectacle. What's more, lots of
          students from other colleges in Bangalore join the fun, making Infin8
          a true festival of creativity and celebration.
        </p>
      </section>

      <section className="team-section">
        <h2 className="section-title">MEET OUR TEAM</h2>
        <button className="team-btn" onClick={() => navigate("/teams")}>
          VIEW TEAM
        </button>
      </section>

      <FaqSection />
    </div>
  );
}

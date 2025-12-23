import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FaqSection from "../../components/FaqSection/FaqSection";
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import infin8logo from "../../assets/infin8-logo.png"
import footerbg from "../../assets/footer-bg.png"
import shell1 from "../../assets/shell1.png"
import shell2 from "../../assets/shell2.png"
import iiitblogo from "../../assets/iiitb-logo.png"
import banner from "../../assets/banner.png"
import whale from "../../assets/about-shark.png"
import aboutimg from "../../assets/About.svg"
import aboutinfin8 from "../../assets/Infin8.svg"
import "./HomePage.css";
import CountDownTimer from "./CountDownTimer";


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

        <div className="timer-loc">
          <h2 className="theme">UNDER THE SEA</h2>
          <h3 className="comingsoon">COMING SOON</h3>
          <CountDownTimer/>
        </div>

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
        <img src={aboutimg} alt="about" className="about-img"/>
        <img src={aboutinfin8} alt="infin8" className="about-infin8-img"/>
        <img src={whale} alt="whale" className="whale"/>
        <p className="about-text">
          The annual cultural bash at IIIT-B, is a three-day extravaganza filled with<br/> vibrant shows, performances, competitions, games, and stalls.
          <br/><br/>
          A unique and exciting experience for everyone
          <br/><br/>
          Talented artists from all corners of India come to showcase their skills,<br/> turning it into a thrilling spectacle. What's more, lots of students from<br/> other colleges in Bangalore join the fun, making Infin8 a true festival of<br/> creativity and celebration.
        </p>
      </section>

      <section className="team-section">
        <h2 className="section-title">MEET OUR TEAM</h2>
        <button className="team-btn" onClick={() => navigate("/teams")}>
          VIEW TEAM
        </button>
      </section>

      <FaqSection />
      <footer id="contact-us">
        <img src={footerbg} className="bg-image"/>
        <img src={shell1} className="shell shell1"/>
        <img src={shell2} className="shell shell2"/>
        <img src={iiitblogo} className="iiitb-logo"/>
        <img src={banner} className="banner"/>
        <img src={infin8logo} className="footer-infin8-logo"/>
        <div className="banner-text">
          <p>INFIN8. 2026. INFIN8. 2026. INFIN8 2026.</p>
        </div>
        <div className="social-icons">
          <h2 className="get-in-touch">Get in touch.</h2>
          <a href="https://x.com/infin8_iiitb" className="icon">
            <span>Twitter</span>
            <FaTwitter />
          </a>
          <a href="https://www.instagram.com/infin8_iiitb/" className="icon">
            <span>Instagram</span>
            <FaInstagram />
          </a>
          <a href="https://in.linkedin.com/company/infin8-iiitb" className="icon">
            <span>LinkedIn</span>
            <FaLinkedin />
          </a>
          <a href="https://www.facebook.com/infin8iiitb/" className="icon">
            <span>Facebook</span>
            <FaFacebook />
          </a>
        </div>
      </footer>
    </div> 
  );
}

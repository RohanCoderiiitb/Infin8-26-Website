import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FaqSection from "../../components/FaqSection/FaqSection";
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import infin8logo from "../../assets/Footer/infin8-logo.png";
import footerbg from "../../assets/footer/footer-bg.png";
import shell1 from "../../assets/footer/shell1.png";
import shell2 from "../../assets/footer/shell2.png";
import iiitblogo from "../../assets/footer/iiitb-logo.png";
import banner from "../../assets/footer/banner.png";
import whale from "../../assets/about-shark.png";
import aboutimg from "../../assets/About.svg";
import aboutinfin8 from "../../assets/Infin8.svg";
import pufferfish from "../../assets/Home/puffer-fish.png";
import overlayImg from "../../assets/Home/overlay.svg";
import eventgif from "../../assets/Home/events.gif";
import seabed from "../../assets/Home/gallery-seabed.png";
import waves from "../../assets/Home/gallery-waves.png";
import galleryimg1 from "../../assets/Home/gallery-temp1.png";
import galleryimg2 from "../../assets/Home/gallery-temp2.png";
import galleryimg3 from "../../assets/Home/gallery-temp3.png";
import logo from "../../assets/Home/logo.png";
import sand from "../../assets/Home/sand.png";
import fish from "../../assets/Home/fish.png";
import landingPageGif from "../../assets/landing-page.gif";

import CountDownTimer from "./CountDownTimer";
import "./HomePage.css";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const aboutSectionRef = useRef(null);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "#about" },
    { label: "Events", path: "/events" },
    { label: "Team", path: "/teams" },
  ];

  return (
    <div className="home-wrapper">
      <section className="hero-section">
        <img
          src={overlayImg}
          alt=""
          className="hero-overlay"
          loading="eager"
          fetchPriority="high"
        />
        <div className="hero-content">
          <motion.img
            src={logo}
            alt="logo"
            className="hero-left-logo"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
          />
          <CountDownTimer />
        </div>

        <button onClick={() => setOpen(true)} className="hamburger-btn">
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
                      if (item.label === "About") {
                        if (aboutSectionRef.current) {
                          aboutSectionRef.current.scrollIntoView({
                            behavior: "smooth",
                          });
                        }
                        setOpen(false);
                      } else {
                        navigate(item.path);
                        setOpen(false);
                      }
                    }}
                  >
                    {item.label.toUpperCase()}
                  </motion.button>
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        <img src={landingPageGif} alt="landing page" className="landing-gif" />
      </section>

      <section ref={aboutSectionRef} className="about-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.img
            src={aboutimg}
            alt="about"
            className="about-img"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          />

          <motion.img
            src={aboutinfin8}
            alt="infin8"
            className="about-infin8-img"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          />

          <motion.img
            src={whale}
            alt="whale"
            className="whale"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          />

          <motion.p
            className="about-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            The annual cultural bash at IIIT-B, is a three-day extravaganza
            filled with
            <br />
            vibrant shows, performances, competitions, games, and stalls.
            <br />
            <br />
            A unique and exciting experience for everyone
            <br />
            <br />
            Talented artists from all corners of India come to showcase their
            skills,
            <br />
            turning it into a thrilling spectacle. What's more, lots of students
            from
            <br />
            other colleges in Bangalore join the fun, making Infin8 a true
            festival of
            <br />
            creativity and celebration.
          </motion.p>
        </motion.div>
      </section>

      <section className="gallery">
        <motion.div className="moving-image">
          <img
            src={galleryimg1}
            alt="img1"
            className="gallery-img1"
            loading="lazy"
          />
          <img
            src={galleryimg2}
            alt="img2"
            className="gallery-img2"
            loading="lazy"
          />
          <img
            src={galleryimg3}
            alt="img3"
            className="gallery-img3"
            loading="lazy"
          />
        </motion.div>
        <img src={waves} alt="waves" className="waves" loading="lazy" />
        <img src={seabed} alt="seabed" className="seabed" loading="lazy" />
        <img src={sand} alt="sand" className="gallery-sand" loading="lazy" />
        <img src={fish} alt="fish" className="gallery-fish" loading="lazy" />
      </section>

      <section className="events-section">
        <motion.div
          className="events-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="left-content">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Events
            </motion.h2>

            <motion.p
              className="events-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              From heart-thumping dance battles and soulful musical performances
              to intense gaming showdowns and quirky quizzes, Infin8’s events
              are a treasure trove of opportunities to shine. Dive in, compete,
              and experience the thrill of creating memories that last a
              lifetime.
            </motion.p>

            <div className="event-days">
              {[1, 2, 3].map((day) => (
                <motion.div
                  key={day}
                  className="event-card"
                  onClick={() => navigate(`/events?day=${day}`)}
                  role="button"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * day }}
                  viewport={{ once: true }}
                >
                  <motion.img
                    src={pufferfish}
                    alt={`Day ${day}`}
                    className="pufferfish"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <span>Day {day}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="right-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img src={eventgif} alt="event-gif" className="event-gif" />
          </motion.div>
        </motion.div>
      </section>

      <FaqSection />

      <footer id="contact-us">
        <img
          src={footerbg}
          className="bg-image"
          loading="lazy"
          alt="footer background"
        />
        <img
          src={shell1}
          className="shell shell1"
          loading="lazy"
          alt="shell decoration"
        />
        <img
          src={shell2}
          className="shell shell2"
          loading="lazy"
          alt="shell decoration"
        />
        <img
          src={iiitblogo}
          className="iiitb-logo"
          loading="lazy"
          alt="IIITB logo"
        />
        <img src={banner} className="banner" loading="lazy" alt="banner" />
        <img
          src={infin8logo}
          className="footer-infin8-logo"
          loading="lazy"
          alt="Infin8 logo"
        />
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
          <a
            href="https://in.linkedin.com/company/infin8-iiitb"
            className="icon"
          >
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

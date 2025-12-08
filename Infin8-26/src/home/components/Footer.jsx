import React from "react";
import "../styles/Footer.css";
import { Mail, Phone, Linkedin, Smartphone } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact-us">
      <div className="footer-container">
        <div className="footer-main-content">
          {/* IIITB Section */}
          <div className="footer-iiitb-logo">
            <img
            />
          </div>

          {/* infin8 Logo Section */}
          <div className="footer-infin8-logo">
            <img
            />
          </div>

          {/* Contact Icons */}
          <div className="footer-contact">
            <div className="footer-contact-title quicksand-font">GET IN TOUCH</div>
            <div className="footer-contact-icons">
              <a
                href="mailto:sac@iiitb.ac.in"
                className="footer-contact-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail size={28} />
              </a>
              <a
                href="tel:"
                className="footer-contact-icon"
              >
                <Phone size={28} />
              </a>
              <a
                href="https://in.linkedin.com/company/infin8-iiitb"
                className="footer-contact-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={28} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Glow Divider */}
        <div className="footer-bottom">
          <div className="footer-glow-divider" />
          <p className="footer-copyright">
            © 2026 Infin8. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
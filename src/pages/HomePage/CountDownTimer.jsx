import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./CountDownTimer.css";

const TARGET_DATE = new Date("2026-01-30T00:00:00");

export default function CountDownTimer() {
  const getTimeLeft = () => {
    const diff = TARGET_DATE - new Date();
    if (diff <= 0) {
      return { d: "00", h: "00", m: "00", s: "00" };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
      d: String(days).padStart(2, "0"),
      h: String(hours).padStart(2, "0"),
      m: String(minutes).padStart(2, "0"),
      s: String(seconds).padStart(2, "0"),
    };
  };

  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const renderDigits = (value) => (
    <div className="cd-digits">
      <div className="cd-box">
        <span className="cd-digit">{value[0]}</span>
      </div>
      <div className="cd-box">
        <span className="cd-digit">{value[1]}</span>
      </div>
    </div>
  );

  return (
    <motion.div
      className="countdown-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
    >

      <div className="cd-unit">
        {renderDigits(time.d)}
        <span className="cd-label">DAYS</span>
      </div>

      <div className="cd-unit">
        {renderDigits(time.h)}
        <span className="cd-label">HOURS</span>
      </div>

      <div className="cd-unit">
        {renderDigits(time.m)}
        <span className="cd-label">MINUTES</span>
      </div>

      <div className="cd-unit">
        {renderDigits(time.s)}
        <span className="cd-label">SECONDS</span>
      </div>
    </motion.div>
  );
}
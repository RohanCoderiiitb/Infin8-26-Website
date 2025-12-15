import React from 'react'
import { useEffect, useState } from "react";
import "./HomePage.css";

const TARGET_DATE = new Date("2026-01-30T00:00:00");

function CountDownTimer() {
  const calculateTimeLeft = () => {
    const diff = TARGET_DATE - new Date();
    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);

      if(!updated) 
        clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return <div className="countdown-ended"></div>;
  }
  return (
    <div className="countdown">
      <div className="time-box">
        <span>{timeLeft.days}</span>
        <small>DAYS</small>
      </div>
      <div className="time-box">
        <span>{timeLeft.hours}</span>
        <small>HRS</small>
      </div>
      <div className="time-box">
        <span>{timeLeft.minutes}</span>
        <small>MINS</small>
      </div>
      <div className="time-box">
        <span>{timeLeft.seconds}</span>
        <small>SECS</small>
      </div>
    </div>
  );
}
export default CountDownTimer

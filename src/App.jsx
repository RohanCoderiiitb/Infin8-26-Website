import React, { lazy, Suspense } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

const EventPage = lazy(() => import("./pages/Events/EventPage"));
const TeamsPage = lazy(() => import("./pages/Teams/TeamPage"));
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));

function LoadingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-b from-[#1B4FFE] via-[#0c2c97] to-[#072074]">
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative w-28 h-20">
          <div className="absolute inset-0 animate-[swim_2.5s_ease-in-out_infinite]">
            <svg viewBox="0 0 100 60" className="w-full h-full">
              <ellipse
                cx="50"
                cy="35"
                rx="28"
                ry="14"
                fill="#ffffff"
                opacity="0.9"
              />
              <path
                d="M 22 35 Q 12 35, 6 26 Q 12 35, 6 44 Z"
                fill="#ffffff"
                opacity="0.9"
              />
              <path
                d="M 48 21 L 54 10 L 58 21 Z"
                fill="#ffffff"
                opacity="0.9"
              />
              <circle cx="64" cy="32" r="2" fill="#1B4FFE" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-lg font-medium text-white/90 tracking-wide">
            Loading
          </p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes swim {
          0%, 100% {
            transform: translateX(-15px) translateY(0);
          }
          50% {
            transform: translateX(15px) translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/events" element={<EventPage />}></Route>
          <Route path="/teams" element={<TeamsPage />}></Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

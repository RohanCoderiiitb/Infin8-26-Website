import React, { lazy, Suspense } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

const EventPage = lazy(() => import("./pages/Events/EventPage"));
const TeamsPage = lazy(() => import("./pages/Teams/TeamPage"));
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const SponsorsPage = lazy(() => import("./pages/SponsorPage"));

function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0A0A0F] text-white">
      <h1 className="text-3xl font-black">Page under progress...</h1>
      <h2 className="text-xl mt-2">Loading...</h2>
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
          <Route path="/sponsors" element={<SponsorsPage />}></Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

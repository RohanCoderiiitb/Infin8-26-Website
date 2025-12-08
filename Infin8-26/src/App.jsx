import React,{lazy,Suspense} from 'react'
import {Routes,Route,BrowserRouter} from "react-router-dom";

const EventPage = lazy(()=>import("./events/EventPage"));
const TeamsPage = lazy(()=>import("./team/TeamPage"));
const HomePage  = lazy(()=>import("./home/HomePage"));
const SponsorsPage = lazy(()=>import("./sponsors/SponsorPage"));

function LoadingPage(){
  return(
       <div style={{height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F', color: 'white'}}>
      <h1>Page under progress...</h1>
      <h2>Loading...</h2>
    </div>
  );
}

function App() {
  return (
      <BrowserRouter>
        <Suspense fallback={<LoadingPage/>}>
          <Routes>
            <Route path="/" element={<HomePage/>}></Route>
            <Route path="/events" element={<EventPage/>}></Route>
            <Route path="/teams" element={<TeamsPage/>}></Route>
            <Route path="/sponsors" element={<SponsorsPage/>}></Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
  )
}

export default App
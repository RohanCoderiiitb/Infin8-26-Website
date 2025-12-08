import React from 'react';
import '../App.css'; 
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import TeamSection from './components/Team';

const Navbar = () => null;
const AboutSection = () => null;
const EventTimeline = () => null;
const SpecialEvents = () => null;
const Sponsors = () => null;


function Infin8HomePage() {
  return (
    <div className="homepage-container">
      <Navbar />
      <section>
        <AboutSection />
      </section>
      <section>
        <EventTimeline />
      </section>
      <section>
        <SpecialEvents />
      </section>
      <section id="sponsors">
        <Sponsors />
      </section>
      <section>
        <TeamSection/>
      </section>
      <section id="faq">
        <FaqSection />
      </section>
      <section>
        <Footer/>
      </section>
    </div>
  );
};

export default Infin8HomePage;
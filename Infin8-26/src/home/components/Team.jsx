import React from 'react';
import '../styles/Team.css'; 

export default function TeamSection() {
  return (
    <section className="team-section-clean">
      <div className="team-container-clean">
        
        <header className="team-header-clean">
          <h2 className="team-title-clean">MEET OUR TEAM</h2>
        </header>

        <div className="cta-button-container">
          <button className="cta-team-button">
            LOOK AT OUR TEAM →
          </button>
        </div>
        
      </div>
    </section>
  );
}
import React from 'react';
import '../assets/styles/Credits.css';

const Credits = () => {
  const teamMembers = [
    {
      name: "Sibi",
      role: "Full Stack Developer",
      icon: "👨‍💻",
      specialty: "Builds seamless, end-to-end web solutions by combining powerful backend logic with engaging, user-friendly frontend interfaces."
    },
    {
      name: "Hariharan",
      role: "Backend Engineer & UI/UX Developer",
      icon: "🔧",
      specialty: "Builds secure, scalable systems with efficient database management and Crafts intuitive and user-focused experiences with aesthetic appeal."
    },
    {
      name: "Priyanka S",
      role: "UI/UX Developer",
      icon: "🎨",
      specialty: "User Interface & Experience Design with modern design principles"
    },
    {
      name: "Harikrishnan S",
      role: "Software Developer",
      icon: "⚡",
      specialty: "Application Development & Testing with quality assurance expertise"
    }
  ];

  return (
    <div className="credits-container">
      <div className="credits-header">
        <div className="credits-title-section">
          <h1 className="credits-main-title">
            <span className="gradient-text">Development Team</span>
          </h1>
          <p className="credits-subtitle">
            Meet the skilled professionals who architected and developed the 
            LLS Audit Management System with precision and innovation.
          </p>
        </div>
        
        <div className="credits-stats">
          <div className="stat-items">
            <div className="stat-number">4</div>
            <div className="stat-label">Developers</div>
          </div>
          <div className="stat-items">
            <div className="stat-number">1</div>
            <div className="stat-label">System</div>
          </div>
          <div className="stat-items">
            <div className="stat-number">∞</div>
            <div className="stat-label">Possibilities</div>
          </div>
        </div>
      </div>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card">
            <div className="card-content">
              <div className="member-avatar">
                {member.icon}
              </div>
              <h3 className="member-name">{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <div className="member-specialty">
                <div className="specialty-title">Expertise</div>
                <p className="specialty-text">{member.specialty}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="credits-footer">
        <div className="project-info">
          <h3 className="project-title">LLS Audit Management System</h3>
          <p className="project-description">
            A comprehensive enterprise solution engineered for streamlined audit processes, 
            built with cutting-edge technologies and modern architectural patterns. 
            Designed to enhance efficiency, ensure compliance, and provide actionable insights.
          </p>
        </div>
        
        <div className="tech-stack">
          <h4>Technology Stack</h4>
          <div className="tech-icons">
            <span className="tech-badge">React.js</span>
            <span className="tech-badge">JavaScript ES6+</span>
            <span className="tech-badge">CSS3</span>
            <span className="tech-badge">HTML5</span>
            <span className="tech-badge">Node.js</span>
            <span className="tech-badge">REST APIs</span>
          </div>
        </div>
        
        <div className="credits-signature">
          <div className="signature-line">
            <span className="signature-text">Engineered with precision by Team LLS</span>
          </div>
          <div className="copyright">
            <p>© 2024 LLS Audit Management System. All rights reserved.</p>
          </div>
        </div>
      </div>

      <div className="floating-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        
        {/* Particle System */}
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        
        {/* Larger particles */}
        <div className="particle-large"></div>
        <div className="particle-large"></div>
        <div className="particle-large"></div>
        <div className="particle-large"></div>
        <div className="particle-large"></div>
      </div>
    </div>
  );
};

export default Credits;
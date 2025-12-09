import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';  // <-- Make sure you import the CSS file

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-card">

        <h1 className="landing-title">Welcome 👋</h1>
        <p className="landing-subtitle">Login to continue your journey</p>

        <div className="button-group">
          <button 
            className="landing-btn primary" 
            onClick={() => navigate('/student-login')}
          >
            Student
          </button>

          <button 
            className="landing-btn secondary" 
            onClick={() => navigate('/faculty-login')}
          >
            Faculty
          </button>
        </div>

      </div>
    </div>
  );
}

export default Landing;
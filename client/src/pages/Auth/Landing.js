import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="box selection-box">
        <h2>Login as</h2>
        
        {/* Student Button */}
        <button 
          className="big-btn" 
          onClick={() => navigate('/student-login')}
        >
          Student
        </button>

        {/* Faculty Button - NOW ACTIVE */}
        <button 
          className="big-btn secondary" 
          onClick={() => navigate('/faculty-login')}
        >
          Faculty
        </button>
        
      </div>
    </div>
  );
}

export default Landing;
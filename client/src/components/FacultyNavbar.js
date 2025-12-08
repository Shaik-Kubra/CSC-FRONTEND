import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';

function FacultyNavbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo">🎓 Faculty Portal</div>
      
      <div className="nav-links">
        {/* Navigation Links */}
        <Link to="/faculty-portal/dashboard">Dashboard</Link>
        <Link to="/faculty-portal/profile">My Profile</Link>
      </div>

      <div className="profile-actions">
        <button onClick={handleLogout} className="logout-btn-small">Logout</button>
      </div>
    </nav>
  );
}

export default FacultyNavbar;
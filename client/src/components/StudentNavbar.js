import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import './StudentNavbar.css'; // You can copy styles from App.css or create new ones

function StudentNavbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '2px solid #333' }}>
      <div className="logo">🎓 Student Portal</div>
      <div className="nav-links">
        <Link to="/student-portal/home" style={{ margin: '0 10px' }}>Home</Link>
        <Link to="/student-portal/complaints" style={{ margin: '0 10px' }}>Submit Complaints</Link>
        <Link to="/student-portal/responses" style={{ margin: '0 10px' }}>Responses</Link>
      </div>
      <div className="profile-actions">
        <Link to="/student-portal/profile" style={{ marginRight: '10px' }}>👤 Profile</Link>
        <button onClick={handleLogout} className="logout-btn-small">Logout</button>
      </div>
    </nav>
  );
}

export default StudentNavbar;
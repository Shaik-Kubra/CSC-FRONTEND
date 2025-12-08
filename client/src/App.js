import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './api/supabaseClient';

// Components
import StudentNavbar from './components/StudentNavbar';
import FacultyNavbar from './components/FacultyNavbar'; // Ensure this is imported if used

// Auth Pages
import Landing from './pages/Auth/Landing';
import StudentLogin from './pages/Auth/StudentLogin';
import StudentSignup from './pages/Auth/StudentSignup';
import FacultyLogin from './pages/Auth/FacultyLogin';
import FacultySignup from './pages/Auth/FacultySignup';

// Student Portal Pages
import PortalHome from './pages/StudentPortal/PortalHome';
import StudentProfile from './pages/StudentPortal/Profile';
import Complaints from './pages/StudentPortal/Complaints';
import Responses from './pages/StudentPortal/Responses';

// Faculty Portal Pages
import FacultyDashboard from './pages/FacultyPortal/FacultyDashboard';
import FacultyProfile from './pages/FacultyPortal/FacultyProfile';

import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f3f4f6' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* Show Navbar based on Role/Path */}
        {session && window.location.pathname.includes('/student-portal') && <StudentNavbar />}
        {session && window.location.pathname.includes('/faculty-portal') && <FacultyNavbar />}

        <Routes>
          {/* --- PUBLIC AUTH --- */}
          <Route path="/" element={<Landing />} />
          
          {/* FIX: Removed the auto-redirect here. Let the Login Page handle the navigation. */}
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-signup" element={<StudentSignup />} />
          
          {/* FIX: Removed the auto-redirect here too. */}
          <Route path="/faculty-login" element={<FacultyLogin />} />
          <Route path="/faculty-signup" element={<FacultySignup />} />

          {/* --- PROTECTED ROUTES --- */}
          <Route path="/student-portal/home" element={session ? <PortalHome /> : <Navigate to="/" />} />
          <Route path="/student-portal/profile" element={session ? <StudentProfile /> : <Navigate to="/" />} />
          <Route path="/student-portal/complaints" element={session ? <Complaints /> : <Navigate to="/" />} />
          <Route path="/student-portal/responses" element={session ? <Responses /> : <Navigate to="/" />} />

          <Route path="/faculty-portal/dashboard" element={session ? <FacultyDashboard /> : <Navigate to="/" />} />
          <Route path="/faculty-portal/profile" element={session ? <FacultyProfile /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
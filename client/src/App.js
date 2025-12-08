import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'; // <--- Added useLocation
import { supabase } from './api/supabaseClient';

// Components
import StudentNavbar from './components/StudentNavbar';
import FacultyNavbar from './components/FacultyNavbar';

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
    // 1. Check active session
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

    // 2. Listen for Login/Logout events
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
        {/* We moved the Navbar logic into this helper component.
           It lives INSIDE the Router, so it can "see" URL changes.
        */}
        <NavbarManager session={session} />

        <Routes>
          {/* --- PUBLIC AUTH --- */}
          <Route path="/" element={<Landing />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-signup" element={<StudentSignup />} />
          <Route path="/faculty-login" element={<FacultyLogin />} />
          <Route path="/faculty-signup" element={<FacultySignup />} />

          {/* --- PROTECTED ROUTES (Student) --- */}
          <Route path="/student-portal/home" element={session ? <PortalHome /> : <Navigate to="/" />} />
          <Route path="/student-portal/profile" element={session ? <StudentProfile /> : <Navigate to="/" />} />
          <Route path="/student-portal/complaints" element={session ? <Complaints /> : <Navigate to="/" />} />
          <Route path="/student-portal/responses" element={session ? <Responses /> : <Navigate to="/" />} />

          {/* --- PROTECTED ROUTES (Faculty) --- */}
          <Route path="/faculty-portal/dashboard" element={session ? <FacultyDashboard /> : <Navigate to="/" />} />
          <Route path="/faculty-portal/profile" element={session ? <FacultyProfile /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

// --- NEW HELPER COMPONENT ---
// This handles showing the correct Navbar based on the URL
function NavbarManager({ session }) {
  const location = useLocation(); // This Hook forces a re-render when URL changes

  // 1. If not logged in, show nothing
  if (!session) return null;

  // 2. Check the URL path to decide which Navbar to show
  if (location.pathname.includes('/student-portal')) {
    return <StudentNavbar />;
  }
  
  if (location.pathname.includes('/faculty-portal')) {
    return <FacultyNavbar />;
  }

  // 3. If logged in but on a weird page (like root), show nothing
  return null;
}

export default App;
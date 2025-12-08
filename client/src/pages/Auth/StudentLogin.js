import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../api/supabaseClient';

function StudentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Clear session on load
  useEffect(() => {
    const clearSession = async () => {
      await supabase.auth.signOut();
    };
    clearSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Check Credentials (Email & Password)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password: password 
      });

      if (authError) throw authError;

      // 2. SAFETY CHECK: Is this actually a Student?
      // We check if their ID exists in the 'students' table
      const { data: studentData, error: dbError } = await supabase
        .from('students')
        .select('*')
        .eq('id', authData.user.id)
        .single(); // We expect exactly one result

      if (dbError || !studentData) {
        // ERROR: User logged in, but they are NOT in the students table (Must be Faculty)
        await supabase.auth.signOut(); // Kick them out immediately
        throw new Error("Access Denied: This is not a Student account.");
      }

      // 3. If passed both checks, let them in
      navigate('/student-portal/home');
      
    } catch (error) {
      setErrorMsg(error.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="box auth-form">
        <h3>Student Login</h3>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            onFocus={() => setErrorMsg('')}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            onFocus={() => setErrorMsg('')}
          />
          
          {errorMsg && <div className="error-banner">⚠️ {errorMsg}</div>}

          <button type="submit" className="action-btn" disabled={loading}>
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>
        <div className="switch-link">
          <Link to="/student-signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
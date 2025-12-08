import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../api/supabaseClient';

function FacultyLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Clear session on load to ensure a fresh login attempt
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
      // We rename 'data' to 'authData' here so we can use it in Step 2
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password: password 
      });

      if (authError) throw authError;

      // 2. SAFETY CHECK: Is this actually a Faculty member?
      // We use 'authData.user.id' which we got from Step 1
      const { data: facultyData, error: dbError } = await supabase
        .from('faculty')
        .select('*')
        .eq('id', authData.user.id)
        .single(); 

      if (dbError || !facultyData) {
        // ERROR: Logged in, but not found in 'faculty' table (Must be a Student)
        await supabase.auth.signOut(); 
        throw new Error("Access Denied: This is not a Faculty account.");
      }

      // 3. If passed both checks, let them in
      navigate('/faculty-portal/dashboard');
      
    } catch (error) {
      setErrorMsg(error.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="box auth-form">
        <h3>Faculty Login</h3>
        
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
          <Link to="/faculty-signup">Sign up as Faculty</Link>
        </div>
      </div>
    </div>
  );
}

export default FacultyLogin;
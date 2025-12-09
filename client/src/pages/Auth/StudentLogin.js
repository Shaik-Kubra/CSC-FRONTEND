import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../api/supabaseClient';
import './StudentLogin.css';

function StudentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    supabase.auth.signOut();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

      if (authError) throw authError;

      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (studentError || !studentData) {
        await supabase.auth.signOut();
        throw new Error("Access Denied: This is not a student account.");
      }

      navigate("/student-portal/home");

    } catch (err) {
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-login-container">
      <div className="student-login-card">
        <h2 className="login-title">Student Login</h2>

        <form onSubmit={handleLogin} className="login-form">

          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMsg && (
            <div className="error-msg">⚠ {errorMsg}</div>
          )}

          <button className="login-btn" disabled={loading}>
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <p className="signup-link">
          Don’t have an account? <Link to="/student-signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default StudentLogin;
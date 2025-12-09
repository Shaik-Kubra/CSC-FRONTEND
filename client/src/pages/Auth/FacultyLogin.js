import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import "./FacultyLogin.css";

function FacultyLogin() {
  const navigate = useNavigate();

  // STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Clear previous session
  useEffect(() => {
    const clearSession = async () => {
      await supabase.auth.signOut();
    };
    clearSession();
  }, []);

  // LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Step 1 — Authenticate
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (authError) throw authError;

      // Step 2 — Validate Faculty Role
      const { data: facultyData, error: dbError } = await supabase
        .from("faculty")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (dbError || !facultyData) {
        await supabase.auth.signOut();
        throw new Error("Access Denied: This is not a Faculty account.");
      }

      // Step 3 — Success
      navigate("/faculty-portal/dashboard");

    } catch (err) {
      setErrorMsg(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faculty-login-container">
      <div className="faculty-login-card">
        <h3 className="facult-title">Faculty Login</h3>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="faculty-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setErrorMsg("")}
            required
          />

          <input
            type="password"
            className="faculty-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setErrorMsg("")}
            required
          />

          {errorMsg && (
            <div className="faculty-error-msg">⚠ {errorMsg}</div>
          )}

          <button type="submit" className="faculty-login-btn" disabled={loading}>
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <div className="faculty-signup-link">
          <Link to="/faculty-signup">Sign Up as Faculty</Link>
        </div>
      </div>
    </div>
  );
}

export default FacultyLogin;
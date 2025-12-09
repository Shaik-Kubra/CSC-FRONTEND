import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import api from "../../api/api";
import "./FacultySignup.css";   // <-- Your CSS file

function FacultySignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    fid: "",
    email: "",
    phone: "",
    department: "",
    password: ""
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Step 1: Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;

      // Step 2: Save faculty profile in Flask
      await api.post("/register-faculty", {
        id: data.user.id,
        full_name: formData.name,
        fid: formData.fid,
        email: formData.email,
        phone: formData.phone,
        department: formData.department
      });

      alert("Faculty account created successfully!");
      navigate("/faculty-login");

    } catch (err) {
      setErrorMsg(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faculty-signup-container">
      <div className="faculty-signup-card">
        <h3 className="signup-title">Faculty Sign Up</h3>

        {errorMsg && (
          <div className="faculty-error-msg">
            ⚠ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <input
            className="signup-input"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            className="signup-input"
            name="fid"
            placeholder="Faculty ID (FID)"
            onChange={handleChange}
            required
          />

          <input
            className="signup-input"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            className="signup-input"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          <input
            className="signup-input"
            name="department"
            placeholder="Department"
            onChange={handleChange}
            required
          />

          <input
            className="signup-input"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="signup-btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default FacultySignup;
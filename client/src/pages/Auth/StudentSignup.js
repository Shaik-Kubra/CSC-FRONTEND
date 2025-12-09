import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import api from "../../api/api";
import "./StudentSignup.css";

function StudentSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    id: "",
    email: "",
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
      // Step 1: Create user in Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;

      // Step 2: Save profile to Flask
      await api.post("/register-student", {
        id: data.user.id,
        full_name: formData.name,
        student_reg_no: formData.id,
        email: formData.email,
        department: formData.department
      });

      alert("Student account created successfully!");
      navigate("/student-login");

    } catch (err) {
      setErrorMsg(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-signup-container">
      <div className="student-signup-card">
        <h3 className="signup-title">Create Student Account</h3>

        {errorMsg && (
          <div className="student-error-msg">
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
            name="id"
            placeholder="Student Reg No"
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

          <button className="signup-btn" type="submit" disabled={loading}>
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

export default StudentSignup;
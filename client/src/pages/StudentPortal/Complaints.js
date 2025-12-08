import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { supabase } from '../../api/supabaseClient';

function Complaints() {
  const [email, setEmail] = useState('');
  const [desc, setDesc] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id));
  }, []);

  const sendComplaint = async () => {
    if (!userId) return alert("Please log in.");
    try {
      await api.post('/submit-complaint', {
        student_id: userId,
        faculty_email: email,
        description: desc
      });
      alert("Complaint Sent!");
      setEmail('');
      setDesc('');
    } catch (err) {
      alert("Failed. Please check if the Faculty Email is correct.");
    }
  };

  return (
    <div className="portal-page">
      <div className="box complaint-box">
        <h3>Submit Complaint</h3>
        <label>Faculty Email:</label>
        <input 
          placeholder="faculty@college.edu" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <label>Complaint:</label>
        <textarea 
          placeholder="Describe your issue..." 
          value={desc} 
          onChange={(e) => setDesc(e.target.value)} 
          rows={5} 
        />
        <div className="btn-group">
          <button onClick={sendComplaint} className="action-btn">Send</button>
          <button onClick={() => {setEmail(''); setDesc('')}} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Complaints;
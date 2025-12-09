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
      await api.post('/submit-complaint', { student_id: userId, faculty_email: email, description: desc });
      alert("Complaint Sent Successfully!"); setEmail(''); setDesc('');
    } catch (err) { alert("Failed. Check Faculty Email."); }
  };

  const styles = {
    page: {
      minHeight: 'calc(100vh - 60px)',
      background: 'linear-gradient(135deg, #2c7a7b 0%, #319795 100%)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
    },
    card: {
      background: 'white', padding: '40px', borderRadius: '20px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.2)', width: '100%', maxWidth: '600px',
      animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' // Pop-in effect
    },
    input: {
      width: '100%', padding: '15px 20px', marginBottom: '20px', borderRadius: '50px',
      border: '2px solid transparent', background: '#edf2f7', fontSize: '1rem', outline: 'none',
      transition: 'all 0.3s'
    },
    button: {
      width: '100%', padding: '15px', borderRadius: '50px', border: 'none',
      background: '#38b2ac', color: 'white', fontSize: '1.1rem', fontWeight: '600',
      cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(56, 178, 172, 0.4)'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{color: '#2d3748', fontSize: '1.8rem', marginBottom: '10px', fontWeight: '700'}}>Submit a Complaint</h2>
        <p style={{color: '#718096', marginBottom: '30px'}}>Facing an issue? Reach out to your faculty.</p>

        <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#38b2ac', fontSize: '0.9rem'}}>FACULTY EMAIL</label>
        <input 
          placeholder="e.g. faculty@rgukt.in" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={styles.input}
          onFocus={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = '#38b2ac'; }}
          onBlur={(e) => { e.target.style.background = '#edf2f7'; e.target.style.borderColor = 'transparent'; }}
        />

        <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#38b2ac', fontSize: '0.9rem'}}>DESCRIPTION</label>
        <textarea 
          placeholder="Describe your issue in detail..." 
          value={desc} 
          onChange={(e) => setDesc(e.target.value)} 
          rows={5}
          style={{...styles.input, borderRadius: '20px'}}
          onFocus={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = '#38b2ac'; }}
          onBlur={(e) => { e.target.style.background = '#edf2f7'; e.target.style.borderColor = 'transparent'; }}
        />
        
        <button 
          onClick={sendComplaint} 
          style={styles.button}
          onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(56, 178, 172, 0.6)'; }}
          onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(56, 178, 172, 0.4)'; }}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        >
          Send Request
        </button>
      </div>
    </div>
  );
}

export default Complaints;
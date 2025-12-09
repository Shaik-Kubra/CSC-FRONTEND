import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { supabase } from '../../api/supabaseClient';

function Responses() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          const res = await api.get(`/my-complaints/${data.user.id}`);
          setList(res.data);
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchHistory();
  }, []);

  // --- STYLES ---
  const theme = { teal: '#38b2ac', tealDark: '#2c7a7b' };

  const containerStyle = {
    minHeight: 'calc(100vh - 60px)',
    background: 'linear-gradient(135deg, #2c7a7b 0%, #319795 100%)',
    padding: '40px 20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center'
  };

  const cardStyle = (status, index) => ({
    background: 'white',
    borderRadius: '20px',
    padding: '25px',
    width: '100%', maxWidth: '800px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    borderLeft: `6px solid ${status === 'Pending' ? '#ed8936' : theme.teal}`,
    
    // ANIMATION PROPERTIES
    opacity: 0, 
    animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    animationDelay: `${index * 0.1}s`, // Staggers the animation (0.1s, 0.2s, 0.3s...)
    cursor: 'default'
  });

  if (loading) return <div style={{...containerStyle, color: 'white'}}>Loading...</div>;

  return (
    <div style={containerStyle}>
      <h2 style={{ 
        color: 'white', marginBottom: '30px', fontSize: '2rem', 
        animation: 'scaleIn 0.5s ease-out' // Header pops in
      }}>
        Your History
      </h2>
      
      {list.length === 0 && <p style={{color:'white'}}>No history found.</p>}

      {list.map((item, index) => (
        <div 
          key={index} 
          style={cardStyle(item.status, index)}
          className="hover-card" // Adds the hover lift effect from CSS
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #edf2f7', paddingBottom: '10px' }}>
            <span style={{ color: '#718096', fontSize: '0.9rem', fontWeight: '600' }}>📅 {new Date(item.date).toLocaleDateString()}</span>
            <span style={{ 
              background: item.status === 'Pending' ? '#fffaf0' : '#e6fffa', 
              color: item.status === 'Pending' ? '#ed8936' : theme.teal,
              padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'
            }}>
              {item.status.toUpperCase()}
            </span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <p style={{ margin: 0, fontWeight: '700', color: theme.tealDark, fontSize: '0.9rem' }}>QUESTION</p>
            <p style={{ margin: '5px 0 0 0', color: '#2d3748', fontSize: '1.1rem' }}>{item.question}</p>
          </div>

          <div style={{ background: '#f7fafc', padding: '15px', borderRadius: '15px', transition: 'background 0.3s' }}>
            <p style={{ margin: 0, fontWeight: '700', color: '#718096', fontSize: '0.9rem' }}>RESPONSE</p>
            <p style={{ margin: '5px 0', color: '#4a5568', fontStyle: item.status==='Pending'?'italic':'normal' }}>{item.answer}</p>
            {item.status === 'Resolved' && item.faculty_name && (
              <div style={{ marginTop: '10px', fontSize: '0.85rem', color: theme.teal, fontWeight: '600', textAlign: 'right' }}>
                ✔ {item.faculty_name}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Responses;
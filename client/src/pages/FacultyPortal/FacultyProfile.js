import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabaseClient';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function FacultyProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({ 
    name: '', 
    fid: '', 
    email: '', 
    phone: '', 
    department: '' 
  });

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const res = await api.get(`/faculty/profile/${authUser.id}`);
          if (res.data) {
            setUser({
              name: res.data.full_name,
              fid: res.data.fid || 'N/A',
              email: res.data.email,
              phone: res.data.phone || 'N/A',
              department: res.data.department
            });
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- SAVE DATA ---
  const handleSave = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      await api.put(`/faculty/profile/${authUser.id}`, {
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department
      });
      setIsEditing(false);
      alert("Profile Updated Successfully!");
    } catch (error) {
      alert("Update failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // --- STYLES (Teal Theme) ---
  const styles = {
    page: {
      minHeight: 'calc(100vh - 60px)',
      background: 'linear-gradient(135deg, #2c7a7b 0%, #319795 100%)', // Teal Gradient
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '40px 20px'
    },
    card: {
      background: 'white',
      width: '100%',
      maxWidth: '550px',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
      position: 'relative',
      animation: 'scaleIn 0.5s ease-out'
    },
    banner: {
      height: '140px',
      background: 'linear-gradient(to right, #38b2ac, #285e61)', // Teal Banner
      width: '100%'
    },
    content: {
      padding: '0 40px 40px',
      marginTop: '-60px', // Pull content up to overlap banner
      textAlign: 'center'
    },
    avatar: {
      width: '110px',
      height: '110px',
      background: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#319795',
      margin: '0 auto 15px',
      border: '6px solid white',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
    },
    headerName: {
      margin: '0',
      color: '#2d3748',
      fontSize: '1.8rem',
      fontWeight: '800'
    },
    badge: {
      background: '#e6fffa',
      color: '#2c7a7b',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '700',
      display: 'inline-block',
      marginTop: '8px',
      marginBottom: '30px'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '15px',
      textAlign: 'left',
      background: '#f7fafc',
      padding: '25px',
      borderRadius: '16px',
      marginBottom: '25px'
    },
    label: {
      display: 'block',
      fontSize: '0.8rem',
      color: '#718096',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '4px'
    },
    value: {
      color: '#2d3748',
      fontWeight: '600',
      fontSize: '1.05rem',
      margin: 0
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      background: 'white',
      marginBottom: '15px',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    disabledInput: {
      background: '#edf2f7',
      color: '#a0aec0',
      cursor: 'not-allowed'
    },
    btnPrimary: {
      background: '#38b2ac',
      color: 'white',
      border: 'none',
      padding: '12px 30px',
      borderRadius: '50px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem',
      boxShadow: '0 4px 12px rgba(56, 178, 172, 0.3)',
      transition: 'transform 0.1s'
    },
    btnGhost: {
      background: 'transparent',
      color: '#e53e3e',
      border: '1px solid #fc8181',
      padding: '12px 30px',
      borderRadius: '50px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem',
      marginLeft: '10px'
    }
  };

  if (loading) return <div style={{...styles.page, color: 'white'}}>Loading profile...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.banner}></div>
        
        <div style={styles.content}>
          <div style={styles.avatar}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'F'}
          </div>

          {!isEditing ? (
            /* --- VIEW MODE --- */
            <>
              <h2 style={styles.headerName}>{user.name}</h2>
              <span style={styles.badge}>{user.department} Faculty</span>

              <div style={styles.infoGrid}>
                <div>
                  <span style={styles.label}>Faculty ID</span>
                  <p style={styles.value}>{user.fid}</p>
                </div>
                <div style={{borderTop: '1px solid #edf2f7', paddingTop: '10px'}}>
                  <span style={styles.label}>Email Address</span>
                  <p style={styles.value}>{user.email}</p>
                </div>
                <div style={{borderTop: '1px solid #edf2f7', paddingTop: '10px'}}>
                  <span style={styles.label}>Phone Number</span>
                  <p style={styles.value}>{user.phone}</p>
                </div>
              </div>

              <div>
                <button 
                  style={styles.btnPrimary} 
                  onClick={() => setIsEditing(true)}
                  onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                  onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                >
                  Edit Profile
                </button>
                <button style={styles.btnGhost} onClick={handleLogout}>Log Out</button>
              </div>
            </>
          ) : (
            /* --- EDIT MODE --- */
            <div style={{textAlign: 'left'}}>
              <h3 style={{marginBottom: '20px', color: '#2d3748'}}>Edit Details</h3>
              
              <label style={styles.label}>Full Name</label>
              <input 
                style={styles.input} 
                value={user.name} 
                onChange={(e) => setUser({...user, name: e.target.value})} 
              />

              <label style={styles.label}>Phone Number</label>
              <input 
                style={styles.input} 
                value={user.phone} 
                onChange={(e) => setUser({...user, phone: e.target.value})} 
              />

              <label style={styles.label}>Department</label>
              <input 
                style={styles.input} 
                value={user.department} 
                onChange={(e) => setUser({...user, department: e.target.value})} 
              />

              <label style={styles.label}>Faculty ID (Read Only)</label>
              <input 
                style={{...styles.input, ...styles.disabledInput}} 
                value={user.fid} 
                disabled 
              />

              <div style={{textAlign: 'center', marginTop: '20px'}}>
                <button style={styles.btnPrimary} onClick={handleSave}>Save Changes</button>
                <button 
                  style={{...styles.btnGhost, color: '#718096', borderColor: '#cbd5e0'}} 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacultyProfile;
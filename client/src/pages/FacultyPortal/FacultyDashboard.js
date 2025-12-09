import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabaseClient';
import api from '../../api/api';
import FacultySidebar from '../../components/FacultySidebar';
import ReplyModal from '../../components/ReplyModal';

function FacultyDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); 
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 1. Fetch Data on Load
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch complaints (Backend should join students table for reg_id)
          const res = await api.get(`/faculty/complaints/${user.id}`);
          setComplaints(res.data || []);
        }
      } catch (e) {
        console.error("Error fetching complaints:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // 2. Filter Logic (Sidebar Selection)
  const filteredComplaints = complaints.filter(c => {
    if (activeTab === 'unresponded') return c.status === 'Pending';
    if (activeTab === 'responded') return c.status !== 'Pending';
    return true; 
  });

  // 3. Handle Sending Reply
  const handleReplySubmit = async (complaintId, message) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await api.post('/faculty/reply', {
        complaint_id: complaintId,
        faculty_id: user.id,
        response_message: message
      });
      
      alert("Reply sent successfully!");
      setSelectedComplaintId(null); // Close modal
      window.location.reload();     // Refresh list to show updated status
    } catch (err) {
      alert("Failed to send reply. Please try again.");
    }
  };

  // --- STYLES (Teal Theme) ---
  const styles = {
    layout: { 
      display: 'flex', 
      minHeight: 'calc(100vh - 60px)', 
      background: '#f0fdfa' // Very light teal background
    },
    sidebarWrap: { 
      width: '280px', 
      background: 'white', 
      borderRight: '1px solid #e6fffa', 
      boxShadow: '4px 0 20px rgba(0,0,0,0.02)',
      zIndex: 10,
      position: 'sticky',
      top: 0,
      height: 'calc(100vh - 60px)' // Full height minus navbar
    },
    main: { 
      flex: 1, 
      padding: '40px',
      overflowY: 'auto'
    },
    header: { 
      color: '#234e52', // Dark Teal
      marginBottom: '10px',
      fontSize: '2rem',
      fontWeight: '700'
    },
    subtitle: {
      color: '#718096',
      marginBottom: '40px',
      fontSize: '1rem'
    },
    grid: { 
      display: 'grid', 
      gridTemplateColumns: '1fr', // Stack vertically
      gap: '20px',
      maxWidth: '1000px' // Prevent cards from getting too wide on large screens
    },
    card: { 
      background: 'white', 
      borderRadius: '20px', 
      padding: '30px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.02), 0 10px 15px rgba(0,0,0,0.03)', 
      borderLeft: '6px solid #38b2ac', // Teal accent border
      transition: 'transform 0.2s',
      position: 'relative'
    },
    rowBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px'
    },
    studentName: {
      color: '#2d3748',
      fontSize: '1.2rem',
      fontWeight: '700',
      display: 'block'
    },
    studentId: {
      color: '#718096',
      fontSize: '0.9rem',
      fontWeight: '500',
      marginTop: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    date: {
      fontSize: '0.85rem',
      color: '#a0aec0',
      fontWeight: '600'
    },
    complaintBox: {
      background: '#f7fafc',
      padding: '20px',
      borderRadius: '12px',
      color: '#4a5568',
      marginBottom: '25px',
      fontSize: '1rem',
      lineHeight: '1.6',
      border: '1px solid #edf2f7'
    },
    btnReply: { 
      background: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)', 
      color: 'white', 
      border: 'none', 
      padding: '12px 30px', 
      borderRadius: '50px', 
      cursor: 'pointer', 
      fontWeight: '600',
      boxShadow: '0 4px 10px rgba(56, 178, 172, 0.3)',
      transition: 'transform 0.1s'
    },
    btnDone: { 
      background: '#f0fff4', 
      color: '#38a169', 
      border: '1px solid #c6f6d5', 
      padding: '10px 25px', 
      borderRadius: '50px', 
      cursor: 'default',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  return (
    <div style={styles.layout}>
      
      {/* 1. Sidebar */}
      <div style={styles.sidebarWrap}>
        <FacultySidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* 2. Main Content */}
      <div style={styles.main}>
        <div>
          <h2 style={styles.header}>Faculty Dashboard</h2>
          <p style={styles.subtitle}>Manage incoming student queries.</p>
        </div>

        <div style={styles.grid}>
          {loading && <p>Loading complaints...</p>}
          
          {!loading && filteredComplaints.length === 0 && (
            <div style={{textAlign: 'center', color: '#a0aec0', marginTop: '50px'}}>
              No complaints found in this category.
            </div>
          )}

          {filteredComplaints.map((item) => (
            <div 
              key={item.id} 
              style={styles.card}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Header Info */}
              <div style={styles.rowBetween}>
                <div>
                  <span style={styles.studentName}>{item.students?.full_name || "Unknown Student"}</span>
                  <span style={styles.studentId}>
                    <span style={{fontSize:'1.2em'}}>🆔</span> {item.students?.reg_id || "N/A"}
                  </span>
                </div>
                <span style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>

              {/* The Complaint Text */}
              <div style={styles.complaintBox}>
                "{item.description}"
              </div>
              
              {/* Actions */}
              <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                {item.status === 'Pending' ? (
                  <button 
                    onClick={() => setSelectedComplaintId(item.id)} 
                    style={styles.btnReply}
                    onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    Reply to Student
                  </button>
                ) : (
                  <button style={styles.btnDone}>
                    ✓ Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Reply Modal */}
      {selectedComplaintId && (
        <ReplyModal 
          complaintId={selectedComplaintId} 
          onClose={() => setSelectedComplaintId(null)} 
          onSubmit={handleReplySubmit} 
        />
      )}
    </div>
  );
}

export default FacultyDashboard;
import React from 'react';

function FacultySidebar({ activeTab, setActiveTab }) {
  
  // --- STYLES ---
  const styles = {
    container: {
      width: '100%',
      height: '100%',
      padding: '30px 20px',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    title: {
      fontSize: '0.85rem',
      fontWeight: '700',
      color: '#a0aec0',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '15px',
      paddingLeft: '15px'
    },
    button: (isActive) => ({
      width: '100%',
      padding: '14px 20px',
      border: 'none',
      borderRadius: '15px',
      background: isActive ? 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)' : 'transparent',
      color: isActive ? 'white' : '#4a5568',
      fontWeight: isActive ? '700' : '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.2s ease-in-out',
      boxShadow: isActive ? '0 4px 12px rgba(56, 178, 172, 0.3)' : 'none'
    })
  };

  const navItems = [
    { id: 'all', label: 'All Complaints', icon: '📨' },
    { id: 'unresponded', label: 'Unresponded', icon: '⚡' },
    { id: 'responded', label: 'Resolved', icon: '✅' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.title}>Menu</div>
      
      {navItems.map((item) => (
        <button
          key={item.id}
          style={styles.button(activeTab === item.id)}
          onClick={() => setActiveTab(item.id)}
          onMouseEnter={(e) => {
            if (activeTab !== item.id) {
              e.currentTarget.style.background = '#f7fafc';
              e.currentTarget.style.color = '#38b2ac';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== item.id) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#4a5568';
            }
          }}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default FacultySidebar;
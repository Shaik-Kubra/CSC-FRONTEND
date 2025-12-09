import React, { useState } from 'react';
import api from '../../api/api';
import ReactMarkdown from 'react-markdown';

function PortalHome() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your RGUKT Assistant. Ask me about rules, syllabus, or mess menu!',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const askGemini = async () => {
    if (!query.trim()) return;

    // Add user message immediately
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setQuery('');
    setLoading(true);

    try {
      const res = await api.post('/ask-ai', { question: query });
      setMessages([...newMessages, { sender: 'ai', text: res.data.answer }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { sender: 'ai', text: 'Error connecting to AI. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---
  const pageStyle = {
    minHeight: 'calc(100vh - 60px)', // Adjust based on your navbar height
    background: 'linear-gradient(135deg, #2c7a7b 0%, #319795 100%)', // Teal gradient
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  };

  const chatCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '800px',
    height: '75vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle = {
    padding: '20px 30px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
  };

  const headerIconStyle = {
    fontSize: '1.5rem',
    marginRight: '15px',
    color: '#38b2ac', // Teal color for the sparkle
  };

  const chatHistoryStyle = {
    flex: 1,
    padding: '30px',
    overflowY: 'auto',
    backgroundColor: '#f7fafc',
  };

  const messageBubbleStyle = (sender) => ({
    maxWidth: '80%',
    padding: '15px 20px',
    borderRadius: '18px',
    marginBottom: '15px',
    lineHeight: '1.5',
    fontSize: '0.95rem',
    alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
    backgroundColor: sender === 'user' ? '#38b2ac' : '#ffffff', // Teal for user, white for AI
    color: sender === 'user' ? '#ffffff' : '#2d3748',
    boxShadow: sender === 'ai' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
    borderBottomRightRadius: sender === 'user' ? '4px' : '18px',
    borderBottomLeftRadius: sender === 'ai' ? '4px' : '18px',
  });

  const inputAreaStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle = {
    flex: 1,
    padding: '15px 20px',
    borderRadius: '50px',
    border: 'none',
    backgroundColor: '#edf2f7',
    fontSize: '1rem',
    outline: 'none',
    marginRight: '15px',
  };

  const sendButtonStyle = {
    backgroundColor: '#38b2ac', // Teal color
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(56, 178, 172, 0.3)',
    transition: 'transform 0.1s ease-in-out',
  };

  return (
    <div style={pageStyle}>
      <div style={chatCardStyle}>
        
        {/* HEADER */}
        <div style={headerStyle}>
          <span style={headerIconStyle}>✨</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#2d3748' }}>Gemini Assistant</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#718096' }}>Powered by RGUKT Knowledge Base</p>
          </div>
        </div>

        {/* CHAT HISTORY */}
        <div style={chatHistoryStyle}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {messages.map((msg, index) => (
              <div key={index} style={messageBubbleStyle(msg.sender)}>
                {msg.sender === 'ai' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {loading && (
              <div style={{ ...messageBubbleStyle('ai'), fontStyle: 'italic', color: '#a0aec0' }}>
                Typing...
              </div>
            )}
          </div>
        </div>

        {/* INPUT AREA */}
        <div style={inputAreaStyle}>
          <input
            type="text"
            placeholder="Ask a question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && askGemini()}
            style={inputStyle}
            disabled={loading}
          />
          <button 
            onClick={askGemini} 
            style={sendButtonStyle} 
            disabled={loading}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}

export default PortalHome;
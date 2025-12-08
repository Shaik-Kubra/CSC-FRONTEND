import React, { useState } from 'react';
import api from '../../api/api';
import ReactMarkdown from 'react-markdown'; // <--- This does the magic

function PortalHome() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am Gemini. Ask me anything about the college.' }
  ]);
  const [loading, setLoading] = useState(false);

  const askGemini = async () => {
    if (!query.trim()) return;

    // 1. Add User Message to Chat
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setQuery('');
    setLoading(true);

    try {
      // 2. Get API Response
      const res = await api.post('/ask-ai', { question: query });
      
      // 3. Add AI Response to Chat
      setMessages([...newMessages, { sender: 'ai', text: res.data.answer }]);
    } catch (err) {
      setMessages([...newMessages, { sender: 'ai', text: "Error connecting to AI." }]);
    }
    setLoading(false);
  };

  return (
    <div className="portal-page chat-layout">
      <div className="chat-container">
        <div className="chat-header">
          <h3>✨ Gemini Assistant</h3>
        </div>

        {/* Chat History Area */}
        <div className="chat-history">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.sender}`}>
              <div className="message-bubble">
                {msg.sender === 'ai' ? (
                  /* Render Markdown for AI */
                  <div className="markdown-content">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  /* Plain text for User */
                  <p>{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="message-wrapper ai"><div className="message-bubble typing">Thinking...</div></div>}
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Type your question here..." 
            onKeyPress={(e) => e.key === 'Enter' && askGemini()}
          />
          <button onClick={askGemini}>Send ➤</button>
        </div>
      </div>
    </div>
  );
}

export default PortalHome;
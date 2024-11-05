// src/Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from "../Sidebar/Sidebar.jsx";

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [responses, setResponses] = useState([]);

  const handleSendMessage = async () => {
    try {
      const response = await axios.post('http://taka535.duckdns.org:9090/api/v1/solve', userMessage, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });

      setResponses([...responses, { user: userMessage, bot: response.data }]);
      setUserMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Sidebar>
      <div style={{paddingLeft:"10px"}}>
      <h2>AI Chatbot</h2>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {responses.map((res, index) => (
          <div key={index}>
            <strong>User:</strong> {res.user}<br />
            <strong>Bot:</strong> {res.bot}<br /><br />
          </div>
        ))}
      </div>
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message..."
        style={{ width: '80%', marginRight: '10px' }}
      />
      <button onClick={handleSendMessage}>Send</button>
      </div>
    </Sidebar>
  );
};

export default Chatbot;
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from "../Sidebar/Sidebar.jsx";
import CustomTextField from "../CustomTextField/CustomTextField.jsx";
import { Box, Button, CircularProgress } from "@mui/material";

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://taka535.duckdns.org:9090/api/v1/solve', userMessage, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });

      setResponses([...responses, { user: userMessage, bot: response.data }]);
      setUserMessage('');
      setLoading(false);

    } catch (error) {
      console.error('Error sending message:', error);
      alert("에러 발생");
      window.location.reload();
    }
  };

  return (
    <Sidebar>
      <div style={{ paddingLeft: "10px" }}>
        <h2>AI Chatbot</h2>
        <Box
          sx={{
            height: '300px',
            overflowY: 'scroll',
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '10px',
            marginRight: "10px",
            position: "relative",
            background:"#f9f9fa"
          }}
        >
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {responses.map((res, index) => (
            <div key={index}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Box sx={{ background: "#333333", color: "white", borderRadius: "15px", padding: "10px", marginTop: "10px" }}>
                  <strong>사용자:</strong> {res.user}<br />
                </Box>
              </Box>
              <Box sx={{ background: "#333333", borderRadius: "15px", color: "white", padding: "10px", marginTop: "10px" }}>
                <strong>Bot:</strong> {res.bot}<br /><br />
              </Box>
            </div>
          ))}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CustomTextField
            type="text"
            value={userMessage}
            setValue={setUserMessage}
            placeholder="Type your message..."
            style={{ width: '650px', marginRight: '10px' }}
          />
          <Button onClick={handleSendMessage} variant="contained" sx={{ padding: "14px" }}>검색</Button>
        </Box>
      </div>
    </Sidebar>
  );
};

export default Chatbot;

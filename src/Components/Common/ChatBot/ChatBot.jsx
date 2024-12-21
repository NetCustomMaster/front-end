import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from "../Sidebar/Sidebar.jsx";
import CustomTextField from "../CustomTextField/CustomTextField.jsx";
import { Box, Button, CircularProgress } from "@mui/material";
import {useRecoilValue, useRecoilState} from "recoil";
import {urlAtom, activeInputAtom} from "../../recoil/atoms.jsx";

const Chatbot = () => {
    const [userMessage, setUserMessage] = useState('');
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(false);
    const url = useRecoilValue(urlAtom);
    const [activeInput, setActiveInput] = useRecoilState(activeInputAtom);
    const chatContainerRef = useRef(null);

    // 키보드가 나타날 때 채팅 컨테이너의 높이를 조절
    useEffect(() => {
        if (chatContainerRef.current) {
            const keyboardHeight = 300; // 키보드의 대략적인 높이
            const bottomPadding = 20; // 여유 공간
            
            if (activeInput.fieldName === 'chatbot-input') {
                chatContainerRef.current.style.height = `calc(100vh - ${keyboardHeight + bottomPadding}px)`;
            } else {
                chatContainerRef.current.style.height = '100vh';
            }
        }
    }, [activeInput.fieldName]);

    // 키보드를 닫는 함수
    const closeKeyboard = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.style.height = '100vh';
        }
        setActiveInput({ fieldName: null, value: '', setValue: null });
    };

    const handleSendMessage = async () => {
        closeKeyboard();
        if (!userMessage.trim()) return;
        try {
            setLoading(true);
            const response = await axios.post(`${url}/api/v1/solve`, userMessage, {
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
            <Box 
                ref={chatContainerRef}
                sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ padding: "10px" }}>
                    <h2>AI Chatbot</h2>
                </Box>
                
                <Box sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: "0 10px",
                    overflow: 'hidden'
                }}>
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
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
                </Box>

                <Box 
                    sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        width: "100%",
                        padding: "10px",
                        paddingBottom: activeInput.fieldName === 'chatbot-input' ? '320px' : '10px',
                        transition: 'padding-bottom 0.3s ease'
                    }}
                >
                    <CustomTextField
                        fieldName="chatbot-input"
                        value={userMessage}
                        setValue={setUserMessage}
                        placeholder="메시지를 입력하세요..."
                        style={{ width: '600px', marginRight: '10px' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button 
                        onClick={handleSendMessage} 
                        variant="contained" 
                        sx={{ paddingTop:"15px", paddingBottom:"15px" }}
                    >
                        검색
                    </Button>
                </Box>
            </Box>
        </Sidebar>
    );
};

export default Chatbot;

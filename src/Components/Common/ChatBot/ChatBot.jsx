import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar.jsx";
import CustomTextField from "../CustomTextField/CustomTextField.jsx";
import { Box, Button, CircularProgress } from "@mui/material";
import { useRecoilValue, useRecoilState } from "recoil";
import { urlAtom, activeInputAtom } from "../../recoil/atoms.jsx";

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [responses, setResponses] = useState([{ text: "dfdsf" }]);
  const [loading, setLoading] = useState(false);
  const url = useRecoilValue(urlAtom);
  const [activeInput, setActiveInput] = useRecoilState(activeInputAtom);
  const chatContainerRef = useRef(null);

  // 키보드가 나타날 때 채팅 컨테이너의 높이를 조절
  useEffect(() => {
    if (chatContainerRef.current) {
      const keyboardHeight = 300; // 키보드의 대략적인 높이
      const bottomPadding = 20; // 여유 공간

      if (activeInput.fieldName === "chatbot-input") {
        chatContainerRef.current.style.height = `calc(100vh - ${
          keyboardHeight + bottomPadding
        }px)`;
      } else {
        chatContainerRef.current.style.height = "100vh";
      }
    }
  }, [activeInput.fieldName]);

  // 키보드를 닫는 함수
  const closeKeyboard = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.style.height = "100vh";
    }
    setActiveInput({ fieldName: null, value: "", setValue: null });
  };

  const handleSendMessage = async () => {
    closeKeyboard();
    if (!userMessage.trim()) return;
    try {
      setLoading(true);
      const response = await axios.post(`${url}/api/v1/solve`, userMessage, {
        headers: {
          "Content-Type": "text/plain",
        },
      });

      setResponses([...responses, { user: userMessage, bot: response.data }]);
      setUserMessage("");
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("에러 발생");
      window.location.reload();
    }
  };

  return (
    <Sidebar>
      <Box
        ref={chatContainerRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Box sx={{ padding: "10px" }}>
          <h2>AI Chatbot</h2>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "0 10px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              marginRight: "10px",
              position: "relative",
              background: "#f9f9fa",
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
                  <Box
                    sx={{
                      background: "#333333",
                      color: "white",
                      borderRadius: "15px",
                      padding: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <strong>USER:</strong> The internet is not working well.
                    Please tell me the solution.
                    <br />
                  </Box>
                </Box>
                <Box
                  sx={{
                    background: "#333333",
                    borderRadius: "15px",
                    color: "white",
                    padding: "10px",
                    marginTop: "10px",
                  }}
                >
                  <strong>Bot:</strong> I'd be happy to help you troubleshoot
                  the issue, but I'll need more information about your specific
                  problem.
                  <br />
                  Here are a few potential solutions:
                  <br />
                  <br />
                  1. **Restart your router**: Sometimes, simply restarting your
                  router can resolve connectivity issues.
                  <br />
                  Unplug it from power, wait for 30 seconds, and then plug it
                  back in.
                  <br />
                  <br />
                  2. **Check your internet service provider (ISP)**: If you're
                  using a cable or fiber connection,
                  <br />
                  check with your ISP to see if there are any outages or
                  maintenance in your area.
                  <br />
                  You can also try contacting their customer support for
                  assistance.
                  <br />
                  <br />
                  3. **Verify your internet plan**: Make sure you have a stable
                  and active internet plan.
                  <br />
                  Check your account details to ensure you're not exceeding your
                  data limits or using too much bandwidth.
                  <br />
                  <br />
                  4. **Run a speed test**: Use an online speed test tool (e.g.,
                  Speedtest.net) to check your internet speed.
                  <br />
                  This can help identify if the issue is with your connection or
                  with your device.
                  <br />
                  <br />
                  5. **Check for physical obstructions**: Ensure that there are
                  no physical barriers blocking your Wi-Fi signal,
                  <br />
                  such as walls, furniture, or other devices.
                  <br />
                  <br />
                  6. **Update your router's firmware**: If your router is
                  outdated, updating its firmware can improve performance and
                  stability.
                  <br />
                  <br />
                  7. **Restart your device**: Try restarting your computer,
                  phone, tablet, or any other device connected to the internet.
                  <br />
                  <br />
                  If none of these solutions work, you may want to:
                  <br />
                  1. Contact your ISP for further assistance
                  <br />
                  2. Check with friends or family members to see if they're
                  experiencing similar issues
                  <br />
                  3. Consider visiting a nearby library or coffee shop with free
                  Wi-Fi as an alternative
                  <br />
                  <br />
                  Let me know if any of these suggestions help resolve the
                  issue!
                  <br />
                  <br />
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
            paddingBottom:
              activeInput.fieldName === "chatbot-input" ? "320px" : "10px",
            transition: "padding-bottom 0.3s ease",
          }}
        >
          <CustomTextField
            fieldName="chatbot-input"
            value={userMessage}
            setValue={setUserMessage}
            placeholder="type your message"
            style={{ width: "600px", marginRight: "10px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            variant="contained"
            sx={{ paddingTop: "15px", paddingBottom: "15px" }}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Sidebar>
  );
};

export default Chatbot;

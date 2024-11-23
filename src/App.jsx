import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {LoginPage} from "./Components/Login/LoginPage.jsx";
import {DashboardPage} from "./Components/Dashboard/DashboardPage.jsx";
import {KeyboardProvider} from "./Components/Common/KeyboardContext.jsx";
import {Setting} from "./Components/Setting.jsx";
import Chatbot from "./Components/Common/ChatBot/ChatBot.jsx";
import {RegistPage} from "./Components/Login/RegistPage.jsx"; 
import CustomKeyboard from "./Components/Common/CustomKeyboard"; // CustomKeyboard 컴포넌트를 추가합니다.

function App() {
    return (
        <Router>
            <KeyboardProvider>
            <Routes>
                <Route path="/" element={<LoginPage />} />
              <Route path="/regist" element={<RegistPage />} />
                <Route path="/dashboard" element={<DashboardPage />}/>
              <Route path="/setting" element={<Setting />}/>
              <Route path="/chatbot"  element={<Chatbot/>}/>
            </Routes>
            <CustomKeyboard />
            </KeyboardProvider>
        </Router>
    );
}

export default App;

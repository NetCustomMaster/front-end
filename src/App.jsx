import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {LoginPage} from "./Components/Login/LoginPage.jsx";
import {DashboardPage} from "./Components/Dashboard/DashboardPage.jsx";
import {KeyboardProvider} from "./Components/Common/KeyboardContext.jsx";
import {Setting} from "./Components/Setting.jsx";
import Chatbot from "./Components/Common/ChatBot/ChatBot.jsx";
import {RegistPage} from "./Components/Login/RegistPage.jsx"; // 대시보드 컴포넌트를 추가한다고 가정

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
            </KeyboardProvider>
        </Router>
    );
}

export default App;

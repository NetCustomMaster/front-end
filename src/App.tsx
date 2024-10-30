import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {LoginPage} from "./Components/Login/LoginPage.tsx";
import {DashboardPage} from "./Components/Dashboard/DashboardPage.tsx";
import {KeyboardProvider} from "./Components/Common/KeyboardContext.tsx"; // 대시보드 컴포넌트를 추가한다고 가정

function App() {
    return (
        <Router>
            <KeyboardProvider>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />}/>
            </Routes>
            </KeyboardProvider>
        </Router>
    );
}

export default App;

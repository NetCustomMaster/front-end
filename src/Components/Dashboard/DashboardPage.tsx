import SystemInfo from "./SystemInfo.tsx";
import Sidebar from "../Common/Sidebar/Sidebar.tsx";

export const DashboardPage = () => {
    return (
        <>
            <Sidebar>
                <SystemInfo/>
            </Sidebar>
        </>
    );
};
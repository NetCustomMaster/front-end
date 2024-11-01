import  { useEffect, useState } from "react";

const SystemInfo = () => {
    const [systemInfo, setSystemInfo] = useState({
        cpuUsage: '',
        memoryUsage: '',
    });

    useEffect(() => {
        // SSE 연결을 설정합니다.
        const eventSource = new EventSource("http://localhost:8080/system-info/stream");

        eventSource.onmessage = (event) => {
            // 서버로부터 받은 데이터 파싱
            const data = JSON.parse(event.data);
            setSystemInfo({
                cpuUsage: data.cpuUsage,
                memoryUsage: data.memoryUsage,
            });
        };

        eventSource.onerror = () => {
            console.error("Error with EventSource");
            eventSource.close(); // 오류 발생 시 연결 종료
        };

        // 컴포넌트가 언마운트될 때 연결을 닫습니다.
        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div>
            <h3>System Information</h3>
            <p>CPU Usage: {systemInfo.cpuUsage}</p>
            <p>Memory Usage: {systemInfo.memoryUsage}</p>
        </div>
    );
};

export default SystemInfo;
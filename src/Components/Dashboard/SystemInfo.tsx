import  { useEffect, useState, useRef } from 'react';

const SystemInfo = () => {
    const [systemInfo, setSystemInfo] = useState({
        cpuUsage: '',
        memoryUsage: '',
        connectedDevices: [],
    });

    const [internetSpeed, setInternetSpeed] = useState('');
    const [, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(true); // 연결 상태 관리
    const eventSourceRef = useRef(null); // EventSource를 위한 ref

    useEffect(() => {
        const createEventSource = () => {
            // 기존 EventSource가 존재하면 종료
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }

            const eventSource = new EventSource('http://taka535.duckdns.org:9090/api/v1/state/resource');
            // @ts-ignore
            eventSourceRef.current = eventSource; // ref에 저장

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("Received data:", data);
                    setSystemInfo({
                        cpuUsage: data.cpuUsage,
                        memoryUsage: data.memoryUsage,
                        connectedDevices: data.connectedDevices,
                    });
                    setError(null); // 에러 상태 초기화
                    setIsConnected(true); // 연결 상태 갱신
                } catch (e) {
                    // @ts-ignore
                    setError('Error parsing data: ' ,e.message);
                }
            };

            eventSource.onerror = () => {
                setIsConnected(false); // 연결 실패 시 상태 업데이트
                console.log('Connection failed, trying to reconnect...');
                eventSource.close(); // 현재 연결 종료

                // 재연결 로직
                setTimeout(() => {
                    console.log('Reconnecting...');
                    createEventSource(); // 새로운 EventSource 생성
                }, 5000); // 5초 후 재연결 시도
            };
        };

        createEventSource(); // 처음에 이벤트 소스 생성

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close(); // 컴포넌트 언마운트 시 이벤트 소스 종료
            }
        };
    }, []);

    const fetchInternetSpeed = async () => {
        try {
            const response = await fetch('http://taka535.duckdns.org:9090/api/v1/state/speed');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setInternetSpeed(data.internetSpeed);
        } catch (error) {
            // @ts-ignore
            setError('Error fetching internet speed: ',error.message);
        }
    };

    return (
        <div>
            <h1>System Resource Information</h1>
            <p><strong>CPU Usage:</strong> {systemInfo.cpuUsage}</p>
            <p><strong>Memory Usage:</strong> {systemInfo.memoryUsage}</p>
            <p><strong>Internet Speed:</strong> {internetSpeed}</p>
            <p>
                <strong>Connected Devices:</strong>
                {Array.isArray(systemInfo.connectedDevices) && systemInfo.connectedDevices.length > 0
                    ? systemInfo.connectedDevices.join(', ')
                    : 'No connected devices'}
            </p>
            <button onClick={fetchInternetSpeed}>Fetch Internet Speed</button>
            {!isConnected && <p>Reconnecting to server...</p>} {/* 재연결 상태 표시 */}
        </div>
    );
};

export default SystemInfo;
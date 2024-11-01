import { useEffect, useState, useRef } from 'react';

const SystemInfo = () => {
    const [systemInfo, setSystemInfo] = useState({
        cpuUsage: '',
        memoryUsage: '',
        connectedDevices: [],
    });

    const [internetSpeed, setInternetSpeed] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(true);

    // EventSource 타입을 명시적으로 설정
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        const createEventSource = () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }

            const eventSource = new EventSource('http://taka535.duckdns.org:9090/api/v1/state/resource');
            eventSourceRef.current = eventSource;

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
                    setIsConnected(true);
                } catch (e: any) {
                    setError(`Error parsing data: ${e.message}`);
                }
            };

            eventSource.onerror = () => {
                setIsConnected(false);
                console.log('Connection failed, trying to reconnect...');
                if (eventSourceRef.current) {
                    eventSourceRef.current.close();
                }

                setTimeout(() => {
                    console.log('Reconnecting...');
                    createEventSource();
                }, 5000);
            };
        };

        createEventSource();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
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
        } catch (error: any) {
            setError(`Error fetching internet speed: ${error.message}`);
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
            {!isConnected && <p>Reconnecting to server...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SystemInfo;

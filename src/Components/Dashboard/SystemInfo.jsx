import React, { useEffect, useState, useRef } from 'react';
import {Button} from "@mui/material";

const ResourceComponent = () => {
  const [systemInfo, setSystemInfo] = useState({
    cpuUsage: '',
    memoryUsage: '',
    connectedDevices: [],
  });

  const [internetSpeed, setInternetSpeed] = useState({
    ping: '',
    download: '',
    upload: '',
  });

  const [trafficData, setTrafficData] = useState([]); // 트래픽 데이터 상태를 배열로 변경
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true); // 연결 상태 관리
  const eventSourceRef = useRef(null); // EventSource를 위한 ref

  useEffect(() => {
    const createEventSource = () => {
      // 기존 EventSource가 존재하면 종료
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // 시스템 정보 SSE
      const eventSource = new EventSource(`${import.meta.env.VITE_APP_URL}/api/v1/state/resource`);
      eventSourceRef.current = eventSource; // ref에 저장

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setSystemInfo({
            cpuUsage: data.cpuUsage,
            memoryUsage: data.memoryUsage,
            connectedDevices: data.connectedDevices,
          });
          setError(null); // 에러 상태 초기화
          setIsConnected(true); // 연결 상태 갱신
        } catch (e) {
          setError('Error parsing data: ' + e.message);
        }
      };

      eventSource.onerror = (event) => {
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

    const createTrafficEventSource = () => {
      // 트래픽 데이터 SSE
      const trafficEventSource = new EventSource(`${import.meta.env.VITE_APP_URL}/api/v1/device`);

      trafficEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data); // JSON 형태로 파싱
          console.log("Received traffic data:", data);
          setTrafficData(data.trafficInfos || []); // 트래픽 데이터 상태 업데이트
        } catch (e) {
          setError('Error parsing traffic data: ' + e.message);
        }
      };

      trafficEventSource.onerror = (event) => {
        console.log('Traffic EventSource connection failed, trying to reconnect...');
        trafficEventSource.close(); // 현재 연결 종료

        // 재연결 로직
        setTimeout(() => {
          console.log('Reconnecting to traffic data...');
          createTrafficEventSource(); // 새로운 Traffic EventSource 생성
        }, 5000); // 5초 후 재연결 시도
      };
    };

    createEventSource(); // 시스템 정보 이벤트 소스 생성
    createTrafficEventSource(); // 트래픽 데이터 이벤트 소스 생성

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close(); // 컴포넌트 언마운트 시 이벤트 소스 종료
      }
    };
  }, []);

  const fetchInternetSpeed = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/v1/state/speed`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // 인터넷 속도 정보를 상태로 설정
      setInternetSpeed({
        ping: data.ping,
        download: data.download,
        upload: data.upload,
      });
    } catch (error) {
      setError('Error fetching internet speed: ' + error.message);
    }
  };

  return (
    <div>
      <h1>System Resource Information</h1>
      <p><strong>CPU Usage:</strong> {systemInfo.cpuUsage}</p>
      <p><strong>Memory Usage:</strong> {systemInfo.memoryUsage}</p>
      <p><strong>Internet Speed:</strong></p>
      <ul>
        <li><strong>Ping:</strong> {internetSpeed.ping}</li>
        <li><strong>Download:</strong> {internetSpeed.download}</li>
        <li><strong>Upload:</strong> {internetSpeed.upload}</li>
      </ul>
      <h2>Traffic Data:</h2>
      {trafficData.length > 0 ? (
        <ul>
          {trafficData.map((trafficInfo, index) => (
            <li key={index}>
              <strong>IP Address:</strong> {trafficInfo.ipAddress},
              <strong>Last 2s Traffic:</strong> {trafficInfo.last2sTraffic},
              <strong>Direction:</strong> {trafficInfo.direction}
            </li>
          ))}
        </ul>
      ) : (
        <p>No traffic data received</p>
      )}
      <Button variant="contained" onClick={fetchInternetSpeed}>인터넷 속도 측정</Button>
      {!isConnected && <p>Reconnecting to server...</p>} {/* 재연결 상태 표시 */}
    </div>
  );
};

export default ResourceComponent;

import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, CircularProgress } from "@mui/material";

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

  const [trafficData, setTrafficData] = useState([]);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const eventSourceRef = useRef(null);
const [loading,setLoading] = useState(false);
  useEffect(() => {
    const createEventSource = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSource(`${import.meta.env.VITE_APP_URL}/api/v1/state/resource`);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setSystemInfo({
            cpuUsage: data.cpuUsage,
            memoryUsage: data.memoryUsage,
            connectedDevices: data.connectedDevices,
          });
          setError(null);
          setIsConnected(true);
        } catch (e) {
          setError('Error parsing data: ' + e.message);
        }
      };

      eventSource.onerror = (event) => {
        setIsConnected(false);
        console.log('Connection failed, trying to reconnect...');
        eventSource.close();

        setTimeout(() => {
          console.log('Reconnecting...');
          createEventSource();
        }, 5000);
      };
    };

    const createTrafficEventSource = () => {
      const trafficEventSource = new EventSource(`${import.meta.env.VITE_APP_URL}/api/v1/device`);

      trafficEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received traffic data:", data);
          setTrafficData(data.trafficInfos || []);
        } catch (e) {
          setError('Error parsing traffic data: ' + e.message);
        }
      };

      trafficEventSource.onerror = (event) => {
        console.log('Traffic EventSource connection failed, trying to reconnect...');
        trafficEventSource.close();

        setTimeout(() => {
          console.log('Reconnecting to traffic data...');
          createTrafficEventSource();
        }, 5000);
      };
    };

    createEventSource();
    createTrafficEventSource();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const fetchInternetSpeed = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/v1/state/speed`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setInternetSpeed({
        ping: data.ping,
        download: data.download,
        upload: data.upload,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
        <Box sx={{ display: "flex" }}>
          <Box>
            <li><strong>Ping:</strong> {internetSpeed.ping} {loading&&<><CircularProgress size={12} sx={{ marginRight: "10px" }} /> Loading</> }</li>
            <li><strong>Download:</strong> {internetSpeed.download}{loading&& <><CircularProgress size={12} sx={{ marginRight: "10px" }} /> Loading</> }</li>
            <li><strong>Upload:</strong> {internetSpeed.upload} {loading&&<><CircularProgress size={12} sx={{ marginRight: "10px" }} /> Loading</> }</li>
          </Box>


        </Box>
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
      {!isConnected && <p>Reconnecting to server...</p>}
    </div>
  );
};

export default ResourceComponent;

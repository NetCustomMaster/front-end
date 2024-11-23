import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import {Download, NetworkPing, Upload} from "@mui/icons-material";

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
  const [loading, setLoading] = useState(false);

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
            cpuUsage: data.cpuUsage.replace(/%$/, ''),
            memoryUsage: data.memoryUsage,
            connectedDevices: data.connectedDevices,
          });
          setError(null);
          setIsConnected(true);
        } catch (e) {
          setError('Error parsing data: ' + e.message);
        }
      };

      eventSource.onerror = () => {
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
          setTrafficData(data.trafficInfos || []);
        } catch (e) {
          setError('Error parsing traffic data: ' + e.message);
        }
      };

      trafficEventSource.onerror = () => {
        trafficEventSource.close();

        setTimeout(() => {
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

  const CircularProgressWithLabel = ({ value, label }) => (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" >
      <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
      <Box position="relative" display="inline-flex">
        {/* Background CircularProgress in gray */}
        <CircularProgress
          variant="determinate"
          value={100} // Full circle for background
          size={80}
          thickness={5}
          sx={{ color: 'grey.300', position: 'absolute' }} // Gray color and absolute position
        />

        {/* Foreground CircularProgress showing actual value */}
        <CircularProgress
          variant="determinate"
          value={value}
          size={80}
          thickness={5}
          sx={{ position: 'relative' }} // Ensure this is on top
        />

        {/* Centered label */}
        <Box
          position="absolute"
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">
            {`${value}%`}
          </Typography>
        </Box>

      </Box>
    </Box>
  );





  return (
    <div>
      <div style={{width:"100%", marginLeft:"50px"}}>
      <h1>시스템 자원 정보</h1>
      </div>
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        <CircularProgressWithLabel value={systemInfo.cpuUsage} label="CPU 사용량" />
        <CircularProgressWithLabel value={systemInfo.memoryUsage} label="메모리 사용량" />
      </Box>



      <p style={{marginTop:"40px",marginLeft:"50px"}}><strong style={{fontSize:"20px"}}>인터넷 속도 </strong>      </p>
      <ul>
        <Box sx={{ display: "flex", alignItems: "center", gap: "80px" , width:"100%" }}>
          <Box sx={{textAlign: "center"}}>
            <NetworkPing sx={{fontSize: "40px"}}/>
            <Box component="span" sx={{display: "block", fontSize: "12px"}}>Ping</Box>
            <Box component="strong">{internetSpeed.ping}</Box>
            <br/>
            {loading && <CircularProgress size={12} sx={{marginLeft: "5px"}}/>}
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Download  sx={{fontSize:"40px"}}/>
            <Box component="span" sx={{ display: "block", fontSize: "12px" }}>Down</Box>
            <Box component="strong">{internetSpeed.download}</Box>
            {loading && <CircularProgress size={12} sx={{ marginLeft: "5px" }} />}
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Upload  sx={{fontSize:"40px"}}/>
            <Box component="span" sx={{ display: "block", fontSize: "12px" }}>Upload</Box>
            <Box component="strong">{internetSpeed.upload}</Box>
            {loading && <CircularProgress size={12} sx={{ marginLeft: "5px" }} />}
          </Box>
        </Box>

      </ul>
      {/*//todo: 트래픽 기능 오른쪽으로 옮기기*!/*/}
      {/* 임시로 주석*/}
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

      {!isConnected && <p>Reconnecting to server...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Button variant="contained" onClick={fetchInternetSpeed}  sx={{marginLeft:"130px" ,marginTop:"10px"}}>측정 시작</Button>
    </div>
  );
};

export default ResourceComponent;

import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import { Download, NetworkPing, Upload } from "@mui/icons-material";
import { useRecoilState, useRecoilValue } from 'recoil';
import { 
    systemInfoState, 
    errorState, 
    isConnectedState, 
    urlAtom, 
    internetSpeedState 
} from '../recoil/atoms.jsx';
import ReplayIcon from '@mui/icons-material/Replay';
const SystemInfo = () => {
    const [systemInfo, setSystemInfo] = useRecoilState(systemInfoState);
    const [isConnected, setIsConnected] = useRecoilState(isConnectedState);
    const [error, setError] = useRecoilState(errorState);
    const [internetSpeed, setInternetSpeed] = useRecoilState(internetSpeedState);
    const [isLoading, setIsLoading] = useState(false);
    const url = useRecoilValue(urlAtom);

    useEffect(() => {
        let eventSource;
        let retryCount = 0;
        const maxRetries = 5;
        const retryDelay = 5000; // 5초

        const createEventSource = () => {
            if (retryCount >= maxRetries) {
                setError('연결 재시도 횟수 초과. 페이지를 새로고침해주세요.');
                return;
            }

            eventSource = new EventSource(`${url}/api/v1/state/resource`);
           
            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                  
                    const formattedData ={
                        ...data,
                        cpuUsage: data.cpuUsage.replace('%', ''),
                    }
                    console.log("eventData",formattedData);
                    setSystemInfo(formattedData);
                    setError(null);
                    setIsConnected(true);
                    retryCount = 0; // 성공하면 재시도 카운트 초기화
                } catch (e) {
                    setError('Error parsing data: ' + e.message);
                }
            };

            eventSource.onerror = () => {
                console.error(`연결 실패. ${retryCount + 1}번째 재시도 중...`);
                setIsConnected(false);
                setError(`서버 연결 실패. ${retryCount + 1}번째 재시도 중...`);
                eventSource.close();
                retryCount++;
                setTimeout(createEventSource, retryDelay);
            };

            return eventSource;
        };

        const source = createEventSource();

        return () => {
            if (source) {
                source.close();
            }
        };
    }, [url, setSystemInfo, setError, setIsConnected]);

    const fetchInternetSpeed = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${url}/api/v1/state/speed`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setInternetSpeed({
                ping: data.ping,
                download: data.download,
                upload: data.upload,
            });
        } catch (error) {
            setError('Error fetching internet speed: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const CircularProgressWithLabel = ({ value, label }) => (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
            <Box position="relative" display="inline-flex">
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={80}
                    thickness={5}
                    sx={{ color: 'grey.300', position: 'absolute' }}
                />
                <CircularProgress
                    variant="determinate"
                    value={parseFloat(value)}
                    size={80}
                    thickness={5}
                    sx={{ position: 'relative' }}
                />
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

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div>
            <div style={{width:"100%", marginLeft:"50px"}}>
                <h1>시스템 자원 정보<IconButton onClick={handleRefresh} sx={{marginTop:"-10px"}}><ReplayIcon sx={{marginLeft:"10px"}}/></IconButton></h1>
            </div>
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                <CircularProgressWithLabel 
                    value={systemInfo.cpuUsage} 
                    label="CPU 사용량" 
                />
                <CircularProgressWithLabel 
                    value={systemInfo.memoryUsage} 
                    label="메모리 사용량" 
                />
            </Box>

            <p style={{marginTop:"40px",marginLeft:"120px"}}><strong style={{fontSize:"20px"}}>인터넷 속도 </strong>      </p>
            <ul>
                <Box sx={{ display: "flex", alignItems: "center", gap: "60px" , width:"80%" }}>
                    <Box sx={{textAlign: "center"}}>
                        <NetworkPing sx={{fontSize: "40px"}}/>
                        <Box component="span" sx={{display: "block", fontSize: "12px"}}>Ping</Box>
                        <Box component="strong">
                            {isLoading ? <CircularProgress size={20} /> : internetSpeed.ping}
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                        <Download  sx={{fontSize:"40px"}}/>
                        <Box component="span" sx={{ display: "block", fontSize: "12px" }}>Down</Box>
                        <Box component="strong">
                            {isLoading ? <CircularProgress size={20} /> : internetSpeed.download}
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                        <Upload  sx={{fontSize:"40px"}}/>
                        <Box component="span" sx={{ display: "block", fontSize: "12px" }}>Upload</Box>
                        <Box component="strong">
                            {isLoading ? <CircularProgress size={20} /> : internetSpeed.upload}
                        </Box>
                    </Box>
                </Box>

            </ul>

            <Button 
                variant="contained" 
                onClick={fetchInternetSpeed}  
                sx={{marginLeft:"130px" ,marginTop:"10px"}}
                disabled={isLoading}
            >
                {isLoading ? "측정 중..." : "측정 시작"}
            </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SystemInfo;

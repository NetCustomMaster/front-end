import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useRecoilValue } from 'recoil';
import { urlAtom } from '../recoil/atoms.jsx';

const STORAGE_KEY = 'currentTrafficInfo';
const FIVE_MINUTES = 300000; // 5분을 밀리초로 표현

const TrafficCheck = ({ update }) => {
    const [trafficHistory, setTrafficHistory] = useState(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : [];
    });
    console.log("trafficHistory",trafficHistory)
    
    const url = useRecoilValue(urlAtom);

    const updateTrafficData = (newData) => {
        console.log("Received newData:", newData);
        setTrafficHistory(prev => {
            const now = Date.now();
            // Ensure we're working with an array
            const trafficData = Array.isArray(newData.trafficInfos?.trafficInfos) ? 
                newData.trafficInfos.trafficInfos : 
                Array.isArray(newData.trafficInfos) ? 
                    newData.trafficInfos : [];
            
            console.log("Extracted trafficData:", trafficData);
            const updatedData = [...prev, { trafficInfos: trafficData, time: now }];
            const fiveMinutesAgo = now - FIVE_MINUTES;
            const filteredData = updatedData.filter(item => item.time > fiveMinutesAgo);
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
            return filteredData;
        });
    };

    // 트래픽 데이터 이벤트 소스 설정
    useEffect(() => {
        let trafficEventSource;
        const createTrafficEventSource = () => {
            trafficEventSource = new EventSource(`${url}/api/v1/device`);
    
            trafficEventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    updateTrafficData(data);
                } catch (e) {
                    console.error('Error parsing traffic data:', e);
                }
            };
    
            trafficEventSource.onerror = () => {
                console.error('Traffic EventSource failed.');
                trafficEventSource.close();
                setTimeout(createTrafficEventSource, 5000);
            };
        };
    
        createTrafficEventSource();
    
        return () => {
            if (trafficEventSource) {
                trafficEventSource.close();
            }
        };
    }, [url]);

    // 현재 표시할 IP 주소 목록 (고유한 IP 주소만)
    console.log("Raw trafficHistory:", trafficHistory);
    
    const uniqueIPs = [...new Set(
        trafficHistory.flatMap(entry => {
            console.log("Processing entry:", entry);
            // Ensure we're working with an array
            const infos = Array.isArray(entry.trafficInfos) ? entry.trafficInfos :
                         Array.isArray(entry.trafficInfos?.trafficInfos) ? entry.trafficInfos.trafficInfos : [];
            console.log("Extracted trafficInfos:", infos);
            return infos.map(info => info?.ipAddress);
        }).filter(Boolean)
    )];

    console.log("Extracted uniqueIPs:", uniqueIPs);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    // 트래픽 값을 숫자로 변환하는 함수
    const convertTrafficToNumber = (trafficStr) => {
        if (!trafficStr || trafficStr === '0') return 0;
        
        const value = parseFloat(trafficStr);
        const unit = trafficStr.replace(/[0-9.]/g, '').toLowerCase();
        
        switch (unit) {
            case 'kb':
                return value;
            case 'mb':
                return value * 1024;
            case 'gb':
                return value * 1024 * 1024;
            default:
                return value;
        }
    };

    // 트래픽 값을 적절한 단위로 변환
    const formatTrafficValue = (value) => {
        if (value >= 1024 * 1024) { // GB
            return `${(value / (1024 * 1024)).toFixed(1)}Gb`;
        } else if (value >= 1024) { // MB
            return `${(value / 1024).toFixed(1)}Mb`;
        }
        return `${value.toFixed(1)}Kb`;
    };

    // IP별 트래픽 데이터 생성
    const getTrafficDataForIP = (ipAddress) => {
        return trafficHistory.map(entry => {
            const trafficInfos = Array.isArray(entry.trafficInfos) ? entry.trafficInfos : [];
            const sentTraffic = trafficInfos.find(
                info => info?.ipAddress === ipAddress && info?.direction === 'sent'
            );
            const receivedTraffic = trafficInfos.find(
                info => info?.ipAddress === ipAddress && info?.direction === 'received'
            );

            return {
                time: entry.time,
                sent: convertTrafficToNumber(sentTraffic?.last2sTraffic || '0'),
                received: convertTrafficToNumber(receivedTraffic?.last2sTraffic || '0')
            };
        });
    };

    // Y축 범위 계산
    const calculateYAxisDomain = (data) => {
        const allValues = data.flatMap(item => [item.sent, item.received]);
        const maxValue = Math.max(...allValues);
        return [0, maxValue * 1.1]; // 최대값보다 10% 더 높게 설정
    };

    return (
        <Box sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Fixed Title */}
            <Box sx={{
                pb: 1,
                borderBottom: 1,
                borderColor: 'divider',
                position: 'sticky',
                top: 0,
                bgcolor: 'background.paper',
                zIndex: 2,
            }}>
                <Typography variant="h6" sx={{marginLeft: 14}}>
                    트래픽 데이터
                </Typography>
            </Box>

            {/* Scrollable Content */}
            <Box sx={{ 
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                mt: 1,
                '&::-webkit-scrollbar': {
                    width: '8px',
                    marginRight: '-20px', // 스크롤바를 오른쪽으로 이동
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1'
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '4px'
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555'
                }
            }}>
                <Grid container spacing={2} direction="column">
                    {uniqueIPs.map(ipAddress => (
                        <Grid item xs={12} key={ipAddress}>
                            <Box sx={{ 
                                p: 1, 
                                bgcolor: 'background.paper', 
                                borderRadius: 1,
                                boxShadow: 1,
                                mb: 2
                            }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    IP: {ipAddress}
                                </Typography>
                                {trafficHistory.length > 0 ? (
                                    <LineChart
                                        width={320}
                                        height={250}
                                        data={getTrafficDataForIP(ipAddress)}
                                        margin={{
                                            top: 5,
                                            right: 0,
                                            left: 3,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="time"
                                            tickFormatter={formatTime}
                                            interval="preserveEnd"
                                        />
                                        <YAxis 
                                            tickFormatter={formatTrafficValue}
                                            domain={calculateYAxisDomain(getTrafficDataForIP(ipAddress))}
                                        />
                                        <Tooltip 
                                            formatter={(value) => [formatTrafficValue(value), '트래픽']}
                                            labelFormatter={formatTime}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="sent"
                                            stroke="#8884d8"
                                            name="송신"
                                            dot={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="received"
                                            stroke="#82ca9d"
                                            name="수신"
                                            dot={false}
                                        />
                                    </LineChart>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        트래픽 데이터가 없습니다.
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default TrafficCheck;
import Sidebar from "../Common/Sidebar/Sidebar.jsx";
import { Box, Grid, Typography } from "@mui/material";
import SystemInfo from "./SystemInfo.jsx";
import TrafficCheck from "./TrafficCheck.jsx";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {errorState, internetSpeedState, isConnectedState, systemInfoState, urlAtom} from "../recoil/atoms.jsx";

export const DashboardPage = () => {
    const [systemInfo, setSystemInfo] = useRecoilState(systemInfoState);
    const [isConnected, setIsConnected] = useRecoilState(isConnectedState);
    const [error, setError] = useRecoilState(errorState);
    const internetSpeed = useRecoilValue(internetSpeedState);
    const setInternetSpeed = useSetRecoilState(internetSpeedState);
    const url = useRecoilValue(urlAtom);
    const fetchInternetSpeed = async () => {
        try {
            const response = await fetch(`${url}/api/v1/state/speed`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setInternetSpeed(data.internetSpeed);
        } catch (error) {
            setError(`Error fetching internet speed: ${error.message}`);
        }
    };

    useEffect(() => {
        let eventSource;

        const createEventSource = () => {
            eventSource = new EventSource(`${url}/api/v1/state/resource`);

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
                    setError(`Error parsing data: ${e.message}`);
                }
            };

            eventSource.onerror = () => {
                setIsConnected(false);
                console.log('Connection failed, trying to reconnect...');
                eventSource.close();
                setTimeout(() => {
                    createEventSource();
                }, 5000);
            };
        };

        createEventSource();

        return () => {
            if (eventSource) {
                eventSource.close();
                console.log("EventSource closed");
            }
        };
    }, [setSystemInfo, setIsConnected, setError]);

    return (
      <Sidebar>
          <Grid container spacing={2}>
              <Grid item xs={6}>
                  <SystemInfo
                    systemInfo={systemInfo}
                    isConnected={isConnected}
                    fetchInternetSpeed={fetchInternetSpeed}
                    error={error}
                    internetSpeed={internetSpeed}
                  />
              </Grid>
              <Grid item xs={6}>
                  <Box sx={{ height: "480px", overflowY: "auto" }}>
                      <Typography sx={{ fontWeight: "700", fontSize: "18px", mt: "20px" }}>
                          연결 기기 트래픽 (Mbps)
                      </Typography>
                      <Box sx={{ height: "100%", overflowY: "auto" }}>
                          <TrafficCheck />
                          <TrafficCheck />
                          <TrafficCheck />
                      </Box>
                  </Box>
              </Grid>
          </Grid>
      </Sidebar>
    );
};

export default DashboardPage;

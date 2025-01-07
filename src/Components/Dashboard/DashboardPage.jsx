import Sidebar from "../Common/Sidebar/Sidebar.jsx";
import { Box, Grid, Typography } from "@mui/material";
import SystemInfo from "./SystemInfo.jsx";
import TrafficCheck from "./TrafficCheck.jsx";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  errorState,
  internetSpeedState,
  isConnectedState,
  systemInfoState,
  urlAtom,
} from "../recoil/atoms.jsx";
import MockTrafficComponent from "./MockTrafficComponent.jsx";

const TRAFFIC_STORAGE_KEY = "currentTrafficInfo";

export const DashboardPage = () => {
  const [systemInfo, setSystemInfo] = useRecoilState(systemInfoState);
  const [isConnected, setIsConnected] = useRecoilState(isConnectedState);
  const [error, setError] = useRecoilState(errorState);
  const internetSpeed = useRecoilValue(internetSpeedState);
  const url = useRecoilValue(urlAtom);
  const [update, setUpdate] = useState(false);
  const handleUpdate = () => {
    setUpdate(!update);
  };
  const [trafficData, setTrafficData] = useState(() => {
    const savedTrafficData = localStorage.getItem(TRAFFIC_STORAGE_KEY);
    return savedTrafficData ? JSON.parse(savedTrafficData) : [];
  });

  console.log(trafficData);

  const updateTrafficData = (newData) => {
    const currentData = localStorage.getItem(TRAFFIC_STORAGE_KEY);
    const parsedData = currentData ? JSON.parse(currentData) : [];

    const updatedData = [
      ...parsedData,
      { trafficInfos: newData, time: Date.now() },
    ];

    const fiveMinutesAgo = Date.now() - 300000;
    const filteredData = updatedData.filter(
      (item) => item.time > fiveMinutesAgo
    );

    localStorage.setItem(TRAFFIC_STORAGE_KEY, JSON.stringify(filteredData));
    setTrafficData(filteredData);
  };

  const fetchInternetSpeed = async () => {
    try {
      const response = await fetch(`${url}/api/v1/state/speed`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.text();
      const parsedData = JSON.parse(data);

      setIsConnected(true);
      setError(null);
    } catch (error) {
      console.error("Error fetching internet speed:", error);
      setError(error.message);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    let trafficEventSource;
    const createTrafficEventSource = () => {
      trafficEventSource = new EventSource(`${url}/api/v1/device`);

      trafficEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          updateTrafficData(data);
        } catch (e) {
          setError("Error parsing traffic data: " + e.message);
        }
      };

      trafficEventSource.onerror = () => {
        setError("Traffic EventSource failed.");
        trafficEventSource.close();
        setTimeout(createTrafficEventSource, 5000);
      };
    };

    createTrafficEventSource();
    const interval = setInterval(fetchInternetSpeed, 2000);

    return () => {
      if (trafficEventSource) {
        trafficEventSource.close();
      }
      clearInterval(interval);
    };
  }, [url]);

  return (
    <Sidebar>
      <Box
        sx={{
          flexGrow: 1,
          p: 0,
          pr: 0,
          display: "flex",
          flexDirection: "column",
          height: "470px",
        }}
      >
        <Grid container spacing={1} sx={{ height: "470px" }}>
          {/* Fixed System Info */}
          <Grid item xs={6} sx={{ height: "470px" }}>
            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: 1,
                boxShadow: 1,
                height: "470px",
                overflow: "hidden",
              }}
            >
              <SystemInfo update={update} />
            </Box>
          </Grid>

          {/* Fixed Traffic Info Title */}
          <Grid item xs={6} sx={{ height: "100%" }}>
            <Box
              sx={{
                p: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
                boxShadow: 1,
                position: "sticky",
                top: 0,
                zIndex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <TrafficCheck update={trafficData} />
              {/* <MockTrafficComponent /> */}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Sidebar>
  );
};

export default DashboardPage;

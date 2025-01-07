import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useRecoilValue } from "recoil";
import { urlAtom } from "../recoil/atoms.jsx";

const STORAGE_KEY = "currentTrafficInfo";
const FIVE_MINUTES = 300000; // 5분을 밀리초로 표현

const TrafficCheck = ({ update }) => {
  const [trafficHistory, setTrafficHistory] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
  });

  const url = useRecoilValue(urlAtom);

  // Update traffic history with external updates
  useEffect(() => {
    if (update && update.length > 0) {
      setTrafficHistory((prev) => {
        const now = Date.now();
        const newTrafficData = update.map((data) => ({
          trafficInfos: data.trafficInfos,
          time: now,
        }));

        const combinedData = [...prev, ...newTrafficData];
        const filteredData = combinedData.filter(
          (item) => item.time > now - FIVE_MINUTES
        );

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
        return filteredData;
      });
    }
  }, [update]);

  // Extract unique IPs
  const uniqueIPs = [
    ...new Set(
      trafficHistory.flatMap((entry) =>
        entry.trafficInfos.map((info) => info.ipAddress).filter(Boolean)
      )
    ),
  ];

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(
      2,
      "0"
    )}:${String(date.getSeconds()).padStart(2, "0")}`;
  };

  const convertTrafficToNumber = (trafficStr) => {
    if (!trafficStr || trafficStr === "0") return 0;

    const value = parseFloat(trafficStr);
    const unit = trafficStr.replace(/[0-9.]/g, "").toLowerCase();

    switch (unit) {
      case "kb":
        return value;
      case "mb":
        return value * 1024;
      case "gb":
        return value * 1024 * 1024;
      default:
        return value;
    }
  };

  const formatTrafficValue = (value) => {
    if (value >= 1024 * 1024) {
      return `${(value / (1024 * 1024)).toFixed(1)}Gb`;
    } else if (value >= 1024) {
      return `${(value / 1024).toFixed(1)}Mb`;
    }
    return `${value.toFixed(1)}Kb`;
  };

  const getTrafficDataForIP = (ipAddress) => {
    return trafficHistory.map((entry) => {
      const sentTraffic = entry.trafficInfos.find(
        (info) => info.ipAddress === ipAddress && info.direction === "sent"
      );
      const receivedTraffic = entry.trafficInfos.find(
        (info) => info.ipAddress === ipAddress && info.direction === "received"
      );

      return {
        time: entry.time,
        sent: convertTrafficToNumber(sentTraffic?.last2sTraffic || "0"),
        received: convertTrafficToNumber(receivedTraffic?.last2sTraffic || "0"),
      };
    });
  };

  const calculateYAxisDomain = (data) => {
    const allValues = data.flatMap((item) => [item.sent, item.received]);
    const maxValue = Math.max(...allValues);
    return [0, maxValue * 1.1];
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          pb: 1,
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 2,
        }}
      >
        <Typography variant="h6" sx={{ marginLeft: 14 }}>
          Traffic Data
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          mt: 1,
        }}
      >
        <Grid container spacing={2} direction="column">
          {uniqueIPs.map((ipAddress) => (
            <Grid item xs={12} key={ipAddress}>
              <Box
                sx={{
                  p: 1,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  boxShadow: 1,
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  IP: {ipAddress}
                </Typography>
                <LineChart
                  width={320}
                  height={250}
                  data={getTrafficDataForIP(ipAddress)}
                  margin={{ top: 5, right: 0, left: 3, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tickFormatter={formatTime}
                    interval="preserveEnd"
                  />
                  <YAxis
                    tickFormatter={formatTrafficValue}
                    domain={calculateYAxisDomain(
                      getTrafficDataForIP(ipAddress)
                    )}
                  />
                  <Tooltip
                    formatter={(value) => [formatTrafficValue(value), "트래픽"]}
                    labelFormatter={formatTime}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sent"
                    stroke="#8884d8"
                    name="upload"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="received"
                    stroke="#82ca9d"
                    name="download"
                    dot={false}
                  />
                </LineChart>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TrafficCheck;

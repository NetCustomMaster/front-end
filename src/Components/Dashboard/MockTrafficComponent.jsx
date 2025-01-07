import React, { useState, useEffect } from "react";
import TrafficCheck from "./TrafficCheck";

const MockTrafficComponent = () => {
  const [mockData, setMockData] = useState([]);

  useEffect(() => {
    // 2초 간격으로 예시 데이터를 업데이트
    const interval = setInterval(() => {
      const now = Date.now();
      const newTraffic = {
        trafficInfos: [
          {
            ipAddress: "172.24.1.143",
            direction: "sent",
            last2sTraffic: `${(Math.random() * 500 + 100).toFixed(2)}Kb`,
          },
          {
            ipAddress: "172.24.1.143",
            direction: "received",
            last2sTraffic: `${(Math.random() * 1000 + 500).toFixed(2)}Kb`,
          },
        ],
        time: now,
      };

      setMockData((prevData) => [...prevData, newTraffic]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return <TrafficCheck update={mockData} />;
};

export default MockTrafficComponent;

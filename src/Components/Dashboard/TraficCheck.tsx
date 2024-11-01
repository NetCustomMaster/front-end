import {Box, Card, Typography} from "@mui/material";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export const TraficCheck = () => {
    const data = [
        { name: '10:00', up: 50, down: 30, amt: 20 },
        { name: '10:05', up: 70, down: 45, amt: 40 },
        { name: '10:10', up: 60, down: 65, amt: 50 },
        { name: '10:15', up: 80, down: 55, amt: 60 },
        { name: '10:20', up: 90, down: 75, amt: 70 },
        { name: '10:25', up: 85, down: 60, amt: 80 },
        { name: '10:30', up: 95, down: 70, amt: 85 },
    ];
    return (
        <>

            <Card sx={{ padding: "16px", boxShadow: 3, marginTop: "10px", background: "#f8f5fb" ,marginRight:"5px"}}>
                <Typography sx={{ fontWeight: "500", fontSize: "16px" }}>
                    기기명: sm-s24
                </Typography>
                <Box sx={{ width: "100%", height: 200, mt: 2, marginLeft:"-30px" }}>
                    <ResponsiveContainer width="115%" height="100%">
                        <LineChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis label={{ value: 'Mbps', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="up" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="down" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </Card></>
    );
};
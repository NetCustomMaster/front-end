import SystemInfo from "./SystemInfo.tsx";
import Sidebar from "../Common/Sidebar/Sidebar.tsx";
import {Box, Button, Grid, Typography} from "@mui/material";
import {TraficCheck} from "./TraficCheck.tsx";



export const DashboardPage = () => {

    return (
        <>
            <Sidebar>
                <Grid container spacing={2} sx={{ height: "100%" }}>
                    <Grid item xs={6}>
                        <SystemInfo />
                        <Box sx={{ marginTop: "60%" }}>
                            <Button variant="contained" color="primary" fullWidth sx={{ marginTop: "10px" }}>
                                설정
                            </Button>
                            <Button variant="contained" color="primary" fullWidth sx={{ marginTop: "10px" }}>
                                문제 해결
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={{ fontWeight: "700", fontSize: "18px",mt:"20px" }}>
                            연결 기기 트래픽 (Mbps)
                        </Typography>
                        <Box sx={{ height: "433px", overflowY:"auto" }}>

                            <TraficCheck/>
                            <TraficCheck/>
                            <TraficCheck/>
                        </Box>
                    </Grid>
                </Grid>
            </Sidebar>
        </>
    );
};

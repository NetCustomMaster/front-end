import Sidebar from "./Common/Sidebar/Sidebar.jsx";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import CustomTextField from "./Common/CustomTextField/CustomTextField.jsx";

export const Setting = () => {
  const [SSID, setSSID] = useState("");
  const [password, setPassword] = useState("");
  const inputRef = useRef(null);
  const [adminPw, setAdminPw] = useState("");

  return (
    <Sidebar>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>설정</Typography>



        <Grid container spacing={2}>
          <Grid item xs={12} sx={{marginTop:"10px"}}>
          <Box sx={{fontSize:"20px", borderBottom:"1px solid black"}}>와이파이 설정</Box>
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              label="SSID"
              required
              fullWidth
              id="SSID"
              name="SSID"
              fieldName="SSID"
              value={SSID}
              setValue={setSSID}
              inputRef={inputRef} // emailRef로 변경
            />
          </Grid>
          <Grid item xs={12}>

            <CustomTextField
              fullWidth
              label="와이파이 비밀번호"
              required
              id="SSID"
              name="SSID"
              type="password"
              fieldName="SSID"
              value={password}
              setValue={setPassword}
              inputRef={inputRef} // emailRef로 변경
            />
          </Grid>
          <Grid item xs={12} sx={{marginTop:"20px"}}>
            <Box sx={{fontSize:"20px", borderBottom:"1px solid black"}}>관리자 계정 설정</Box>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label="관리자 ID"
              required
              id="adminId"
              name="adminId"
              type="text"
              fieldName="adminId"
              value={"admin"}
              disabled
              inputRef={inputRef} // emailRef로 변경
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label="관리자 PW"
              required
              id="adminPw"
              name="adminPw"
              type="password"
              fieldName="adminPw"
              value={adminPw}
              setValue={setAdminPw}
              inputRef={inputRef} // emailRef로 변경
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">대역폭</FormLabel>
              <RadioGroup row aria-label="bandwidth" name="bandwidth">
                <FormControlLabel value="2.4Ghz" control={<Radio />} label="2.4Ghz" />
                <FormControlLabel value="5Ghz" control={<Radio />} label="5Ghz" />
              </RadioGroup>
            </FormControl>

          </Grid>
          <Button variant={"contained"} sx={{margin:"0px auto", padding:"10px 40px"}}>적용</Button>
        </Grid>
      </Box>

    </Sidebar>
  );
};

export default Setting;

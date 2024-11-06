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
import axios from "axios";
import {useRecoilValue} from "recoil";
import {urlAtom} from "./recoil/atoms.jsx";
import {useNavigate} from "react-router-dom";

export const Setting = () => {
  const [SSID, setSSID] = useState("");
  const [password, setPassword] = useState("");
  const inputRef = useRef(null);
  const [adminPw, setAdminPw] = useState("");
  const [newPasswd,setNewPasswd] = useState("");
  const [passwdCheck,setPasswdCheck] = useState("");
  const url = useRecoilValue(urlAtom);
const navi = useNavigate();

  const updatePasswd =()=> {
    const fetchData = async () =>{
    const response = axios.post(`${url}/api/v1/setting/changepassword`, {
      password:adminPw,
      newpassword: newPasswd,
      newpasswordcheck: passwdCheck

    })
      alert("비밀번호가 변경되었습니다.")
      window.location.reload();
      navi("/");
      console.log(response.data);
  }
    fetchData();
  }
  const updateWifi=()=>{
    const fetchData = async () =>{
      const response = axios.patch(`${url}/api/v1/setting/wifipassword`, {
        ssid:SSID,
        newpassword:password
      })
      console.log(response.data);
    }
    fetchData();

  }



  useEffect(() => {
    const fetchData= async() =>{
      const data = await axios.get(`${url}/api/v1/setting/wifipassword`);
      // console.log(data.data);
      setSSID(data.data[0]);
      setPassword(data.data[1]);
    }
    fetchData();
  }, []);

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
              type="password"
              fieldName="SSID"
              value={password}
              setValue={setPassword}
              inputRef={inputRef} // emailRef로 변경
            />
          </Grid >
            <Button variant={"contained"} sx={{margin:"0px auto", marginTop:"20px",padding:"10px 40px"}} onClick={updateWifi}>적용</Button>
          <Grid item xs={12} sx={{marginTop:"20px"}}>
            <Box sx={{fontSize:"20px", borderBottom:"1px solid black"}}>관리자 비밀번호 재설정</Box>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label="관리자 ID"
              required
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
              label="기존 비밀번호"
              required
              type="password"
              fieldName="adminPw"
              value={adminPw}
              setValue={setAdminPw}
              inputRef={inputRef} // emailRef로 변경
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label="새 비밀번호"
              required
              type="password"
              fieldName="adminPw"
              value={newPasswd}
              setValue={setNewPasswd}
              inputRef={inputRef} // emailRef로 변경
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label="비밀번호 확인"
              required
              id="adminPw"
              name="adminPw"
              type="password"
              fieldName="adminPw"
              value={passwdCheck}
              setValue={setPasswdCheck}
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
          <Button variant={"contained"} sx={{margin:"0px auto", padding:"10px 40px"}} onClick={updatePasswd}>적용</Button>
        </Grid>
      </Box>

    </Sidebar>
  );
};

export default Setting;

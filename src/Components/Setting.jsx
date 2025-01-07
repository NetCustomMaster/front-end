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
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CustomTextField from "./Common/CustomTextField/CustomTextField.jsx";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { urlAtom } from "./recoil/atoms.jsx";
import { useNavigate } from "react-router-dom";

export const Setting = () => {
  const [SSID, setSSID] = useState("");
  const [password, setPassword] = useState("");
  const inputRef = useRef(null);
  const [adminPw, setAdminPw] = useState("");
  const [newPasswd, setNewPasswd] = useState("");
  const [passwdCheck, setPasswdCheck] = useState("");
  const url = useRecoilValue(urlAtom);
  const [band, setBand] = useState(""); // Wi-Fi band 상태 기본값 설정
  const [loading, setLoading] = useState(false);
  console.log(band);

  const updatePasswd = async () => {
    try {
      const response = await axios.post(
        `${url}/api/v1/setting/changepassword`,
        {
          password: adminPw,
          newpassword: newPasswd,
          newpasswordcheck: passwdCheck,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("비밀번호 변경 중 오류 발생:", error);
    }
  };

  const updateBand = async () => {
    try {
      const response = await axios.patch(`${url}/api/v1/setting/band`, {
        band,
      });
      console.log(response.data, "data");
      alert("주파수가 변경되었습니다.");
    } catch (error) {
      alert("주파수 설정 중 오류 발생");
      console.error(error);
    }
  };

  const updateWifi = async () => {
    try {
      const response = await axios.patch(`${url}/api/v1/setting/wifipassword`, {
        ssid: SSID,
        newpassword: password,
      });
      console.log(password, "password");
      alert("비밀번호가 변경되었습니다.");
      window.location.reload();
      console.log(response.data);
    } catch (error) {
      console.error("Wi-Fi 설정 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/setting/band`);
        setBand(response.data.toString()); // 현재 설정된 주파수 값을 상태에 저장
        console.log(response.data, "data");
      } catch (error) {
        console.error("주파수 정보 가져오기 중 오류 발생:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(`${url}/api/v1/setting/wifipassword`);
        setSSID(data.data[0]);
        setPassword(data.data[1]);
        console.log(data.data[1]);
      } catch (error) {
        console.error("Wi-Fi 정보 가져오기 중 오류 발생:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Sidebar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2, marginTop: 2 }}>
          Setting
        </Typography>

        <Grid container spacing={2}>
          {/* 와이파이 설정 */}
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <Box sx={{ fontSize: "20px", borderBottom: "1px solid black" }}>
              Wifi Setting
            </Box>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              label="SSID"
              required
              fullWidth
              fieldName="SSID"
              value={SSID}
              setValue={setSSID}
              inputRef={inputRef}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label="wifi password"
              required
              type="password"
              fieldName="password"
              value={password}
              setValue={setPassword}
              inputRef={inputRef}
            />
          </Grid>
          <Button
            variant="contained"
            sx={{ margin: "0px auto", marginTop: "20px", padding: "10px 40px" }}
            onClick={updateWifi}
          >
            Apply
          </Button>

          {/* 관리자 비밀번호 재설정 */}
          {/* <Grid item xs={12} sx={{ marginTop: "20px" }}>
            <Box sx={{ fontSize: "20px", borderBottom: "1px solid black" }}>
              관리자 비밀번호 재설정
            </Box>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label="관리자 ID"
              required
              type="text"
              fieldName="adminId"
              value="admin"
              disabled
              inputRef={inputRef}
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
              inputRef={inputRef}
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
              inputRef={inputRef}
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
              inputRef={inputRef}
            />
          </Grid>
          <Button
            variant="contained"
            sx={{ margin: "0px auto", padding: "10px 40px", marginTop: "20px" }}
            onClick={updatePasswd}
          >
            적용
          </Button> */}

          {/* 주파수 설정 */}
          <Grid item xs={12} sx={{ marginTop: "20px" }}>
            <Box sx={{ fontSize: "20px", borderBottom: "1px solid black" }}>
              Frequency Band Setting
            </Box>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Frequency</FormLabel>
              <RadioGroup
                row
                aria-label="bandwidth"
                name="band"
                onChange={(e) => setBand(e.target.value)}
              >
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="2.4Ghz"
                  checked={band === "2"}
                />
                <FormControlLabel
                  value="5"
                  control={<Radio />}
                  label="5Ghz"
                  checked={band === "5"}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Button
            variant="contained"
            sx={{
              margin: "0px auto",
              padding: "10px 40px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
            onClick={updateBand}
          >
            Apply
          </Button>
        </Grid>
      </Box>
    </Sidebar>
  );
};

export default Setting;

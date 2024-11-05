import React, {useState, useRef, useLayoutEffect, useEffect} from 'react';
import {
    Box,
    Button,
    Container,
    createTheme,
    CssBaseline,
    ThemeProvider,
    Typography,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import CustomTextField from '../Common/CustomTextField/CustomTextField.jsx';
import axios from "axios";
import {useRecoilValue} from "recoil";
import {urlAtom} from "../recoil/atoms.jsx";

const theme = createTheme();

const LoginForm = ({regist}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordCheck,setPasswordCheck] = useState("");
    const navi = useNavigate();
    const url = useRecoilValue(urlAtom);
    useEffect(() => {
        axios.get(`${url}/api/v1/auth/check-login`)
          .then(response => {
              console.log(response.data);
              if(response.data==="회원가입페이지"){
                  navi("/regist");
              }else{


              }
          })
          .catch(error => {
              console.error(error);
          });
    }, []);


    const handleLogin = (e) => {
        e.preventDefault();
        if(regist){
            const fetchData = async () => {
                const data = await axios.post(`${url}/api/v1/auth/register`,{username:email,password})
                console.log(data);
                if(data.data==="회원가입 완료"){
                    navi("/dashboard")
                }else{
                    alert("로그인에 실패하였습니다.")
                }
            }
            fetchData();
        }else{
            const fetchData = async () => {
                const data = await axios.post(`${url}/api/v1/auth/login`,{username:email,password})
                console.log("로그인",data);
                if(data.data==="로그인 성공"){
                    navi("/dashboard")
                }else{
                    alert("로그인에 실패하였습니다.")
                }
            }
            fetchData();

        }

    };



    // `useLayoutEffect`를 사용하여 활성화된 필드에 포커스를 강제로 유지
    const inputRef = useRef(null);


    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        {regist?"회원가입":"로그인"}
                    </Typography>
                    <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                        <CustomTextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="아이디"
                            name="email"
                            autoComplete="email"
                            fieldName="email"
                            value={email}
                            setValue={setEmail}
                            inputRef={inputRef} // emailRef로 변경
                        />
                        <CustomTextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="비밀번호"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            fieldName="password"
                            value={password}
                            setValue={setPassword}
                            inputRef={inputRef} // passwordRef로 변경
                        />
                        {regist&&                 <CustomTextField
                          margin="normal"
                          required
                          fullWidth
                          name="passwordCheck"
                          label="비밀번호 확인"
                          type="password"
                          id="passwordCheck"
                          autoComplete="current-password"
                          fieldName="password"
                          value={passwordCheck}
                          setValue={setPasswordCheck}
                          inputRef={inputRef} // passwordRef로 변경
                        />}


                        {error && (
                            <Typography color="error" align="center" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleLogin}
                        >
                            {regist?"계정 생성":"로그인"}
                        </Button>
                    </Box>
                </Box>
            </Container>

        </ThemeProvider>
    );
};

export default LoginForm;

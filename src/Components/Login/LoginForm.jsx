import React, { useState, useRef, useLayoutEffect } from 'react';
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
import CustomTextField from '../Common/CustomTextField/CustomTextField';

const theme = createTheme();

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navi = useNavigate();


    const handleLogin = (e) => {
        e.preventDefault();
        console.log('로그인 시도:', email, password);
        setError('잘못된 이메일 또는 비밀번호입니다.');
        navi("/dashboard");
    };



    // `useLayoutEffect`를 사용하여 활성화된 필드에 포커스를 강제로 유지
    const inputRef = useRef<HTMLInputElement>(null);
    useLayoutEffect(() => {
        if (inputRef.current !== null) inputRef.current.focus();
    });

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
                        로그인
                    </Typography>
                    <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                        <CustomTextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="이메일 주소"
                            name="email"
                            autoComplete="email"
                            autoFocus
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
                        >
                            로그인
                        </Button>
                    </Box>
                </Box>
            </Container>

        </ThemeProvider>
    );
};

export default LoginForm;

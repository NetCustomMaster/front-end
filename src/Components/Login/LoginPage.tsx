import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    Container,
    createTheme,
    CssBaseline,
    TextField,
    ThemeProvider,
    Typography,
} from '@mui/material';
import CustomKeyboard from "../Common/CustomKeyboard";

const theme = createTheme();

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [text, setText] = useState(''); // 키보드로 입력한 값을 저장하는 상태
    const [activeInput, setActiveInput] = useState<'email' | 'password' | null>(null); // 현재 활성화된 입력 필드

    // Ref로 이메일과 패스워드 입력 필드를 참조
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('로그인 시도:', email, password);
        setError('잘못된 이메일 또는 비밀번호입니다.');
    };

    const handleInputFocus = (input: 'email' | 'password') => {
        setActiveInput(input); // 활성화된 입력 필드 설정
        setText(input === 'email' ? email : password); // 해당 입력 필드의 값을 키보드 입력값에 반영
    };

    // 키보드 입력 처리 함수
    const handleKeyboardInput = (input: string) => {
        setText(input); // 키보드로 입력한 값을 상태로 저장

        // 현재 포커스된 입력 필드에 값을 설정하고 포커스 유지
        if (activeInput === 'email') {
            setEmail(input); // 이메일 필드에 입력 값 덮어쓰기
            emailRef.current?.focus(); // 이메일 필드에 포커스 유지
        } else if (activeInput === 'password') {
            setPassword(input); // 비밀번호 필드에 입력 값 덮어쓰기
            passwordRef.current?.focus(); // 비밀번호 필드에 포커스 유지
        }
    };

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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="이메일 주소"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onFocus={() => handleInputFocus('email')} // 이메일 필드 포커스
                            onChange={(e) => setEmail(e.target.value)}
                            inputRef={emailRef} // 이메일 필드에 ref 연결
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="비밀번호"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onFocus={() => handleInputFocus('password')} // 비밀번호 필드 포커스
                            onChange={(e) => setPassword(e.target.value)}
                            inputRef={passwordRef} // 비밀번호 필드에 ref 연결
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
            {activeInput && (
                <CustomKeyboard
                    text={text}
                    setText={handleKeyboardInput} // CustomKeyboard의 입력을 처리하는 함수 전달
                />
            )}
        </ThemeProvider>
    );
};

export default LoginPage;

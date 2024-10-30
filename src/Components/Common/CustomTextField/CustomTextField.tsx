import React, { useRef, useState, useLayoutEffect } from 'react';
import { TextField, TextFieldProps, Box } from '@mui/material';
import { useRecoilState } from 'recoil';
import { activeInputAtom } from '../../recoil/atoms';
// @ts-ignore
import CustomKeyboard from '../CustomKeyboard';
import { keyframes } from '@mui/system';

const blink = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
`;

// @ts-ignore
interface CustomTextFieldProps extends TextFieldProps {
    fieldName: string;
    value: string;
    setValue: (value: string) => void;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
                                                             fieldName,
                                                             value,
                                                             setValue,
                                                             ...props
                                                         }) => {
    const [activeInput, setActiveInput] = useRecoilState(activeInputAtom);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocus = () => {
        if (activeInput !== fieldName) {
            setActiveInput(fieldName);
            setShowKeyboard(true);
        }
    };

    const handleBlur = () => {
        setShowKeyboard(false);
        setActiveInput(null);
    };

    useLayoutEffect(() => {
        if (showKeyboard && activeInput === fieldName && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showKeyboard, activeInput, fieldName]);

    return (
        <Box position="relative">
            <TextField
                {...props}
                inputRef={inputRef}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        position: 'relative',
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: '2px',
                        },
                        '&::after': {
                            content: "''",
                            position: 'absolute',
                            right: 0,
                            width: '2px',
                            height: '100%',
                            backgroundColor: 'black',
                            animation: `${blink} 1s infinite`,
                            visibility: activeInput === fieldName ? 'visible' : 'hidden',
                        },
                    },
                }}
            />
            {showKeyboard && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0, // 화면의 왼쪽에 맞추기
                        width: '100%',
                        zIndex: 1000,
                    }}
                >
                    <CustomKeyboard
                        value={value}
                        setValue={setValue}
                        onClose={() => setShowKeyboard(false)}
                    />
                </Box>
            )}
        </Box>
    );
};

export default CustomTextField;

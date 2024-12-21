import React, { useRef } from 'react';
import { TextField, Box } from '@mui/material';
import { useRecoilState } from 'recoil';
import { activeInputAtom } from '../../recoil/atoms.jsx';
import CustomKeyboard from '../CustomKeyboard';

const CustomTextField = ({
    fieldName,
    value,
    setValue,
    ...props
}) => {
    const [activeInput, setActiveInput] = useRecoilState(activeInputAtom);
    const inputRef = useRef(null);

    const handleFocus = () => {
        if (activeInput.fieldName !== fieldName) {
            setActiveInput({
                fieldName,
                value,
                setValue
            });
        }
    };

    const handleClick = () => {
        setTimeout(() => {
            if (inputRef.current) {
                const rect = inputRef.current.getBoundingClientRect();
                const topOffset = 10;

                window.scrollTo({
                    top: window.scrollY + rect.top - topOffset,
                    behavior: 'smooth',
                });

                setTimeout(() => {
                    inputRef.current.focus();
                }, 300);
            }
        }, 0);
    };

    return (
        <Box position="relative" sx={{overflow:"visible"}} onClick={handleClick}>
            <TextField
                {...props}
                inputRef={inputRef}
                onClick={handleClick}
                onFocus={handleFocus}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </Box>
    );
};

export default CustomTextField;

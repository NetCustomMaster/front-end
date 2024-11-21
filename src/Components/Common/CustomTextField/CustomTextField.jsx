import React, { useRef, useState, useLayoutEffect } from 'react';
import { TextField, Box } from '@mui/material';
import { useRecoilState } from 'recoil';
import { activeInputAtom } from '../../recoil/atoms.jsx';
import CustomKeyboard from '../CustomKeyboard';
import { keyframes } from '@mui/system';

const blink = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
`;

const CustomTextField = ({
                           fieldName,
                           value,
                           setValue,
                           ...props
                         }) => {
  const [activeInput, setActiveInput] = useRecoilState(activeInputAtom);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef(null);

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

  const handleClick = () => {
    setTimeout(() => {
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const topOffset = 10; // 화면 상단 여유 공간

        // TextField를 화면 최상단으로 스크롤
        window.scrollTo({
          top: window.scrollY + rect.top - topOffset,
          behavior: 'smooth',
        });

        // DOM 업데이트 후 포커스 설정
        setTimeout(() => {
          inputRef.current.focus();
        }, 300); // 스크롤 완료 후 지연
      }
    }, 0); // 초기 딜레이
  };


  useLayoutEffect(() => {
    if (showKeyboard && activeInput === fieldName && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showKeyboard, activeInput, fieldName]);



  return (
    <Box position="relative" sx={{overflow:"visible"}} onClick={handleClick}>
      <TextField
        {...props}
        inputRef={inputRef}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {showKeyboard && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
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

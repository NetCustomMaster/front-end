import { useState, useRef } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./keyboard.css"
import { KoreanLayout, EnglishLayout } from "./Layouts.jsx";
import { Box, styled } from "@mui/material";
import hangul from "hangul-js";

const KeyboardWrapper = styled(Box)`
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: white;
    display: flex;
    justify-content: center;
    padding: 10px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const CustomKeyboard = ({ value, setValue, onClose }) => {
    const [layoutName, setLayoutName] = useState("default");
    const [isKorean, setIsKorean] = useState(true);
    const [isKeyPressed, setIsKeyPressed] = useState(false);
    const keyPressTimer = useRef(null);

    const onKeyPress = (key) => {
        if (isKeyPressed) return; // 이미 키가 눌려있는 상태면 추가 입력 방지

        if (key === "{bksp}" || key === "{pre}") {
            setValue((prev) => prev.slice(0, -1));
        } else if (key === "{shift}") {
            setLayoutName((prev) => (prev === "default" ? "shift" : "default"));
        } else if (key === "{lang}") {
            setIsKorean((prev) => !prev);
        } else if (key === "{space}") {
            setValue((prev) => prev + " ");
        } else if (key === "{enter}") {
            onClose(); // Enter 키를 누르면 키보드를 닫음
        } else {
            if (isKorean) {
                setValue((prev) => hangul.assemble(hangul.disassemble(prev + key)));
            } else {
                setValue((prev) => prev + key);
            }
        }
    };

    const handleTouchStart = (event) => {
        event.preventDefault();
        setIsKeyPressed(true);
    };

    const handleTouchEnd = (event) => {
        event.preventDefault();
        setIsKeyPressed(false);
        if (keyPressTimer.current) {
            clearTimeout(keyPressTimer.current);
            keyPressTimer.current = null;
        }
    };

    const handleMouseDown = (event) => {
        event.preventDefault(); // CustomKeyboard 클릭 시 이벤트 전파 막기
    };

    return (
        <KeyboardWrapper onMouseDown={handleMouseDown} onClick={(e)=>e.stopPropagation()} style={{width:"780px"}}>
            <Keyboard
                onClick={(e)=>e.stopPropagation()}
                layout={isKorean ? KoreanLayout : EnglishLayout}
                layoutName={layoutName}
                onKeyPress={onKeyPress}
                inputName="keyboard"
                display={{
                    "{bksp}": "Backspace",
                    "{space}": "Space",
                    "{enter}": "Enter",
                    "{pre}": "Back",
                    "{shift}": "Shift",
                    "{lang}": "Lang",
                }}
                value={value}
                physicalKeyboardHighlight={false}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                stopMouseDownPropagation={true}
                preventMouseDownDefault={true}
            />
        </KeyboardWrapper>
    );
};

export default CustomKeyboard;

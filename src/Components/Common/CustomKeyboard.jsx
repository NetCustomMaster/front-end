import { useState, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./keyboard.css"
import { KoreanLayout, EnglishLayout } from "./Layouts.jsx";
import { Box, styled } from "@mui/material";
import hangul from "hangul-js";
import { useRecoilState } from 'recoil';
import { activeInputAtom } from '../recoil/atoms.jsx';

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

const CustomKeyboard = () => {
    const [layoutName, setLayoutName] = useState("default");
    const [isKorean, setIsKorean] = useState(true);
    const [activeInput, setActiveInput] = useRecoilState(activeInputAtom);

    useEffect(() => {
        const preventContextMenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };
        
        document.addEventListener('contextmenu', preventContextMenu);
        return () => {
            document.removeEventListener('contextmenu', preventContextMenu);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const keyboard = document.querySelector('.simple-keyboard');
            if (keyboard && !keyboard.contains(event.target) && 
                !event.target.closest('input') && !event.target.closest('button')) {
                setActiveInput({ fieldName: null, value: '', setValue: null });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setActiveInput]);

    const onKeyPress = (key) => {
        if (!activeInput.setValue) return;

        if (key === "{bksp}" || key === "{pre}") {
            activeInput.setValue((prev) => prev.slice(0, -1));
        } else if (key === "{shift}") {
            setLayoutName((prev) => (prev === "default" ? "shift" : "default"));
        } else if (key === "{lang}") {
            setIsKorean((prev) => !prev);
        } else if (key === "{space}") {
            activeInput.setValue((prev) => prev + " ");
        } else if (key === "{enter}") {
            setActiveInput({ fieldName: null, value: '', setValue: null });
        } else {
            if (isKorean) {
                activeInput.setValue((prev) => hangul.assemble(hangul.disassemble(prev + key)));
            } else {
                activeInput.setValue((prev) => prev + key);
            }
        }
    };

    if (!activeInput.fieldName) return null;

    return (
        <KeyboardWrapper 
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }}
            style={{width:"780px",zIndex:"1000"}}
        >
            <Keyboard
                onClick={(e) => e.stopPropagation()}
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
                value={activeInput.value}
                disableCaretPositioning={true}
                disableRowButtonContainers={true}
                preventMouseDownDefault={true}
            />
        </KeyboardWrapper>
    );
};

export default CustomKeyboard;

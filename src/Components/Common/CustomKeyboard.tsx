import { useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { KoreanLayout, EnglishLayout } from "./Layouts"; // 한글 및 영어 레이아웃
import { Box, styled } from "@mui/material";
import hangul from "hangul-js"; // 한글 조합 처리

// 스타일 수정: 화면의 맨 아래에 위치하고, 너비를 100%로 설정
const KeyboardWrapper = styled(Box)`
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: white; /* 필요에 따라 배경색 설정 */
    display: flex;
    justify-content: center;
    padding: 10px; /* 위아래 여백을 추가 */
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* 위쪽 그림자 효과 */
`;

const CustomKeyboard = ({ text, setText }) => {
    const [layoutName, setLayoutName] = useState("default"); // default or shift
    const [isKorean, setIsKorean] = useState(true); // 한글/영어 전환 상태

    const onKeyPress = (key) => {
        if (key === "{pre}") {
            // 백스페이스 기능
            const res = text.slice(0, -1);
            setText(res);
        } else if (key === "{shift}") {
            // Shift 레이아웃 토글
            setLayoutName((prev) => (prev === "default" ? "shift" : "default"));
        } else if (key === "{lang}") {
            // 언어 전환 버튼
            setIsKorean((prev) => !prev); // 한글/영어 전환
        } else if (key === "{space}") {
            setText((prev) => prev + " ");
        } else {
            // 한글 자모 조합 (한글 상태일 때만 조합)
            if (isKorean) {
                setText((prev) => hangul.assemble(hangul.disassemble(prev + key)));
            } else {
                setText((prev) => prev + key); // 영어일 경우 그대로 추가
            }
        }
    };

    return (
        <KeyboardWrapper>
            <Keyboard
                layout={isKorean ? KoreanLayout : EnglishLayout} // 한글 또는 영어 레이아웃 사용
                layoutName={layoutName} // 현재 레이아웃
                onKeyPress={onKeyPress} // 키보드 입력 처리 함수
                inputName="keyboard"
                display={{
                    "{bksp}": "Backspace",
                    "{space}": "Space",
                    "{enter}": "Enter",
                    "{pre}": "Back",
                    "{shift}": "Shift",
                    "{lang}": "Lang" // 언어 전환 버튼 추가
                }}
                value={text} // 현재 입력 상태
            />
        </KeyboardWrapper>
    );
};

export default CustomKeyboard;

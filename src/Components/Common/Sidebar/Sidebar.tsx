// Sidebar.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import {useRecoilState, } from 'recoil';
import { showKeyboardAtom} from '../../recoil/atoms';

const LayoutContainer = styled.div`
    display: flex;
    height: 100vh;
`;

const SidebarContainer = styled.div<{ $isOpen: boolean; $isVisible: boolean }>`
    width: ${(props) => (props.$isOpen ? "180px" : props.$isVisible ? "50px" : "0px")};
    background-color: #333;
    color: #fff;
    transition: width 0.3s;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
`;

const MainContentContainer = styled.div<{ $isOpen: boolean; $isVisible: boolean }>`
    flex-grow: 1;
    margin-left: ${(props) => (props.$isOpen ? "10px" : props.$isVisible ? "0px" : "0px")};
    transition: margin-left 0.3s;
    height:480px;
    padding-left:10px;
    overflow-y:auto;
`;

const ToggleButton = styled.button`
    background: none;
    border: none;
    color: white;
    padding: 10px;
    cursor: pointer;
    font-size: 1.5rem;
    align-self: flex-end;
`;

const Menu = styled.ul`
    list-style: none;
    padding: 0;
    margin-top: 20px;
`;

const MenuItem = styled.li`
    padding: 15px;
    font-size: 1.2rem;
    &:hover {
        background-color: #444;
    }
`;

interface SidebarProps {
    children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();
    const [, setShowKeyboard] = useRecoilState(showKeyboardAtom); // recoil 상태 사용
    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleCloseKeyboardAndBlur = (event: React.MouseEvent) => {
        // 이벤트 타겟이 TextField가 아니면 키보드 닫기
        if (!(event.target as HTMLElement).closest('.MuiTextField-root')) {
            setShowKeyboard(false);
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }
    };

    return (
        <LayoutContainer>
            <SidebarContainer $isOpen={isOpen} $isVisible={pathname !== "/"}>
                <ToggleButton onClick={toggleSidebar}>
                    {isOpen ? "⬅️" : "➡️"}
                </ToggleButton>
                <Menu>
                    <MenuItem>
                        <Link to="/dashboard"> {isOpen?"🏠 Home":"🏠"}  </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to="/about">About</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to="/services">Services</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to="/contact">Contact</Link>
                    </MenuItem>
                </Menu>
            </SidebarContainer>
            <MainContentContainer
                $isOpen={isOpen}
                $isVisible={pathname !== "/"}
                onClick={handleCloseKeyboardAndBlur} // 클릭 시 TextField 외부 클릭만 키보드 닫기
            >
                {children}
            </MainContentContainer>

        </LayoutContainer>
    );
};

export default Sidebar;

import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { useRecoilState } from 'recoil';
import { showKeyboardAtom } from '../../recoil/atoms.jsx';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import {Box} from "@mui/material";
import axios, {Axios} from "axios";
const LayoutContainer = styled.div`
    display: flex;
    height: 100vh;
`;

const SidebarContainer = styled.div`
    width: ${(props) => (props.$isOpen ? "170px" : props.$isVisible ? "50px" : "0px")};  /* 사이드바가 확장될 때 180px로 변경 */
    background-color: #333;
    color: #fff;
    transition: width 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 1000;
    overflow: hidden;
`;

const MainContentContainer = styled.div`
    flex-grow: 1;
    margin-left: ${(props) => (props.$isOpen ? "170px" : props.$isVisible ? "55px" : "10px")};  /* 사이드바가 열렸을 때 main 콘텐츠 위치 */
    transition: margin-left 0.3s ease-in-out;
    height: 100vh;
    overflow-y: auto;
`;

const ToggleButton = styled.button`
    background-color:#333333;
    border: none;
    color: white;
    padding: 10px;
    cursor: pointer;
    font-size: 1.5rem;
    position: absolute;
    top: 10px;
    left: ${(props) => (props.$isOpen ? "120px" : "10px")};  /* 토글 버튼 위치를 사이드바 크기에 맞춤 */
    z-index: 1001;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: left 0.3s ease-in-out;
    &:hover {
        background-color: rgba(0, 0, 0, 0.8);
    }
`;

const Menu = styled.ul`
    list-style: none;
    padding: 0;
    margin-top: 60px;
`;

const MenuItem = styled.li`
    padding: 15px;
    font-size: 1.2rem;
    &:hover {
        background-color: #444;
    }
`;

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();
    const [, setShowKeyboard] = useRecoilState(showKeyboardAtom);
    const toggleSidebar = () => setIsOpen(!isOpen);

    const navi = useNavigate();
    const handleCloseKeyboardAndBlur = (event) => {
        if (!(event.target.closest('.MuiTextField-root'))) {
            setShowKeyboard(false);
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }
    };


    return (
      <LayoutContainer>
          <SidebarContainer $isOpen={isOpen} $isVisible={(pathname!== "/" && pathname !=="/regist")}>
              <ToggleButton onClick={toggleSidebar} $isOpen={isOpen}>
                  <MenuIcon sx={{marginLeft:"-10px"}}/>
              </ToggleButton>
              <Menu>
                  <MenuItem>
                      <div onClick={()=>navi("/dashboard")}> {isOpen ? <Box sx={{display:"flex"}}><HomeIcon sx={{marginRight:"5px"}}/>

                          Home</Box> :<HomeIcon/>} </div>
                  </MenuItem>
                  <MenuItem>
                      <div onClick={()=>navi("/setting")}>{isOpen ? <Box sx={{display:"flex"}}><SettingsIcon  sx={{marginRight:"5px"}}/>
                          setting</Box>: <SettingsIcon/>}</div>
                  </MenuItem>
                  <MenuItem>
                      <div onClick={()=>navi("/chatbot")}>{isOpen ? <Box sx={{display:"flex"}}><HelpIcon sx={{marginRight:"5px"}}/>
                          Help</Box>: <HelpIcon/>}</div>
                  </MenuItem>
              </Menu>
          </SidebarContainer>
          <MainContentContainer
            $isOpen={isOpen}
            $isVisible={pathname !== "/"}
            onClick={handleCloseKeyboardAndBlur}
            style={{height:pathname==="/dashboard"?"480px": pathname==="/setting"?"900px":"685px"}}
          >
              {children}
          </MainContentContainer>
      </LayoutContainer>
    );
};

export default Sidebar;

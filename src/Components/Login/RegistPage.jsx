import Sidebar from "../Common/Sidebar/Sidebar.jsx";
import LoginForm from "./LoginForm.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";
import {urlAtom} from "../recoil/atoms.jsx";
import {useRecoilValue} from "recoil";

export const RegistPage = () => {
  const navi = useNavigate();
  const url = useRecoilValue(urlAtom);
  useEffect(() => {
    axios.get(`${url}/api/v1/auth/check-login`)
      .then(response => {
        console.log(response.data);
        if(response.data==="로그인페이지"){
          navi("/");
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  return (
            <Sidebar>
      <LoginForm regist={true}/>
    </Sidebar>
  )
}
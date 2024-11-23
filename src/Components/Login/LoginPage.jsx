// @ts-ignore
import LoginForm from "./LoginForm.jsx";
import Sidebar from "../Common/Sidebar/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const  LoginPage= () => {
    const navigate=useNavigate();

    useEffect(()=>{
navigate("/dashboard");
    },[])
    return (
        <Sidebar>
        <LoginForm/>
        </Sidebar>
    );
};

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataContext } from "../../context/DataContext";

import LoginStyle from "./Login.module.css";
import Style from "../../styles/style.module.css";

import ErrorMsg from "../../components/errormsg/ErrorMsg";

const Login = () => {
    const {name, setName, err, setErr} = useContext(DataContext);

    const navigate = useNavigate();

    useEffect(() => {
        setName("");
    }, []);

    const handleSubmit = () => {
        if(name.length < 3) {
            return setErr("The username must be at least 3 characters");
        }

        setErr("");
        navigate("/rooms");
    };

    const handleError = () => {
        if(err !== ""){
            return <ErrorMsg />
        }
    };

    return (
        <div className={LoginStyle.login}>
            <div className={Style.card}>
                <p className={LoginStyle.text}>Enter your username</p>
                <input
                    type="text"
                    className={Style.field}
                    placeholder="Username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === "Enter"){
                            handleSubmit();
                        }
                    }}
                />
                {handleError()}
                <button
                    className={Style.btn}
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Login;
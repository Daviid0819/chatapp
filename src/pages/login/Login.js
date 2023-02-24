import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataContext } from "../../context/DataContext";

import LoginStyle from "./Login.module.css";
import Style from "../../styles/style.module.css";

const Login = () => {
    const {name, setName} = useContext(DataContext);
    const [err, setErr] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        setName("");
    }, []);

    const handleSubmit = () => {
        if(name.length < 3) {
            return setErr("The username must be at least 3 characters");
        }

        navigate("/rooms");
    };

    const handleError = () => {
        if(err !== ""){
            return (
                <div className={Style.error}>
                    <span>{err}</span>
                </div>
            );
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
                    required
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
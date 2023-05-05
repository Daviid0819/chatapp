import { useContext } from "react";

import { DataContext } from "../../context/DataContext";

import ErrorMsgStyle from "./ErrorMsg.module.css";

const ErrorMsg = () => {
    const {err, setErr} = useContext(DataContext);

    const handleCloseError = () => {
        setErr("");
    };
    
    return (
        <div
            className={ErrorMsgStyle.error}
            onClick={handleCloseError}
        >
            <span>{err}</span>
        </div>
    );
};

export default ErrorMsg;
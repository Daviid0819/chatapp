import { useContext } from "react";
import { io } from "socket.io-client";

import { DataContext } from "../../context/DataContext";

import UserStyle from "./User.module.css";
import Style from "../../styles/style.module.css";

const socket = io.connect("http://localhost:5000");

const User = ({ user, isBoss }) => {
    const {name, userRoom} = useContext(DataContext);

    const handleKickUser = async() => {
        const res = await fetch("http://localhost:5000/room/kick", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify({
                name: userRoom,
                user: user.name
            })
        });

        const data = await res.json();

        if(!data.success) {
            return alert(data.message);
        }

        socket.emit("room:kick", {user: user.name, boss: name});
    };

    const renderKickButton = () => {
        if(isBoss && user.name !== name) {
            return (
                <button
                    className={Style.btn}
                    style={{width: "32px", height: "32px", padding: "0"}}
                    onClick={handleKickUser}
                >
                    X
                </button>
            );
        }
    };
    return (
        <div className={UserStyle.user}>
            <span>{user.name}</span>
            {renderKickButton()}
        </div>
    );
};

export default User;
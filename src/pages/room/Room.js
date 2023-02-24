import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataContext } from "../../context/DataContext";

import RoomStyle from "./Room.module.css";
import Style from "../../styles/style.module.css";

const Room = () => {
    const [err, setErr] = useState("");

    const {name, userRoom, setUserRoom} = useContext(DataContext);

    const navigate = useNavigate();

    useEffect(() => {
        if(name === "" || userRoom === 0){
            return navigate("/");
        }

        const handleRoomExit = async() => {
            const res = await fetch("http://localhost:5000/room/exit", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: userRoom.name,
                    user: name
                })
            });
            await res.json();
        };

        const handleEvent = () => {
            window.addEventListener("beforeunload", e => {
                e.preventDefault();
                return handleRoomExit();
            });
        };

        handleEvent();

        /*window.addEventListener('beforeunload', handleRoomExit);

        return () => {
            window.removeEventListener('beforeunload', handleRoomExit);
        };*/
    }, []);

    const handleRoomDelete = async() => {
        const res = await fetch("http://localhost:5000/room/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: userRoom.name,
                user: name
            })
        });
        await res.json();
    };

    const handleLeaveRoom = async() => {
        const res = await fetch("http://localhost:5000/room/exit", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: userRoom.name,
                user: name
            })
        });

        const data = await res.json();

        if(!data.success){
            return setErr(data.message);
        }

        setUserRoom({});
        navigate("/rooms")
    };

    return (
        <div className={RoomStyle.room}>
            <div className={RoomStyle.info}>
                <div className={RoomStyle.roomname}>
                    <span>{userRoom.name}</span>
                    <button
                        className={Style.btn}
                        style={{width: "30%"}}
                        onClick={handleLeaveRoom}
                    >
                        Leave room
                    </button>
                </div>
                <div className={RoomStyle.users}>
                    {userRoom.users.map((user, i) => {
                        return (
                            <div
                                key={i}
                                className={RoomStyle.user}
                            >
                                <span>{user.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={RoomStyle.chatwindow}>
                <div className={RoomStyle.chat}>
                    Chat
                </div>
                <div className={RoomStyle.message}>
                    Message
                </div>
            </div>
        </div>
    );
};

export default Room;
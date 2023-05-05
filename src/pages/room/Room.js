import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { io } from "socket.io-client";

import { DataContext } from "../../context/DataContext";

import RoomStyle from "./Room.module.css";
import Style from "../../styles/style.module.css";

import Message from "../../components/message/Message";
import User from "../../components/user/User";

const socket = io.connect("http://localhost:5000");

const Room = () => {
    const [room, setRoom] = useState({
        name: "",
        users: [],
        messages: []
    });
    const [msg, setMsg] = useState("");
    const [boss, setBoss] = useState(false);

    const {name, userRoom, setUserRoom, err, setErr} = useContext(DataContext);

    const msgEndRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        if(name === "" || userRoom === ""){
            return navigate("/");
        }

        getRoomInfo();

        socket.emit("room:enter", {user: name, room: userRoom});
    }, []);

    useEffect(() => {
        socket.on("room:deleted", () => {
            socket.emit("room:leave", {room: userRoom, user: name});
            setErr("The boss deleted the room");
            navigate("/rooms");
        });

        socket.on("room:kicked", (data) => {
            socket.emit("room:leave", {room: userRoom, user: name});
            setErr("The boss kicked you from the room");
            navigate("/rooms");
        });

        socket.on("room:update", () => {
            getRoomInfo();
        });
    }, [socket]);

    useEffect(() => {
        scrollToBottom();
    }, [room]);

    const getRoomInfo = async() => {
        const res = await fetch("http://localhost:5000/room/"+userRoom, {
            method: "GET"
        });
        
        const data = await res.json();

        if(!data.success) {
            return setErr(data.message);
        }

        setRoom(data.room);
        setBoss(data.room.boss?.filter(b => b.name === name).length !== 0);
    };

    const handleDeleteRoom = async() => {
        const res = await fetch("http://localhost:5000/room/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: userRoom
            })
        });

        const data = await res.json();

        if(!data.success){
            return alert(data.message);
        }

        setUserRoom("");
        socket.emit("room:delete", {room: userRoom});
        navigate("/rooms");
    };

    const handleLeaveRoom = async() => {
        const res = await fetch("http://localhost:5000/room/exit", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: userRoom,
                user: name
            })
        });

        const data = await res.json();

        if(!data.success){
            return alert(data.message);
        }

        socket.emit("room:leave", {room: userRoom});
        setUserRoom("");
        navigate("/rooms");
    };

    const handleSendMessage = async(e) => {
        if(msg === "") return;

        const res = await fetch("http://localhost:5000/room/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: userRoom,
                user: name,
                message: msg
            })
        });

        const data = await res.json();

        if(!data.success){
            return alert(data.message);
        }

        setMsg("");
        getRoomInfo();
        socket.emit("room:send", {room: userRoom});
    };

    const scrollToBottom = () => {
        msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const renderDeleteBtn = () => {
        if(boss){
            return (
                <button
                    className={Style.btn}
                    style={{width: "30%"}}
                    onClick={handleDeleteRoom}
                >
                    Delete room
                </button>
            );
        }
    };

    return (
        <div className={RoomStyle.room}>
            <div className={RoomStyle.info}>
                <div className={RoomStyle.roomname}>
                    <span>{room.name}</span>
                    <button
                        className={Style.btn}
                        style={{width: "30%"}}
                        onClick={handleLeaveRoom}
                    >
                        Leave room
                    </button>
                    {renderDeleteBtn()}
                </div>
                <div className={RoomStyle.users}>
                    {room.users.map((user) => {
                        return (
                            <User
                                key={user._id}
                                user={user}
                                isBoss={boss}
                            />
                        );
                    })}
                </div>
            </div>
            <div className={RoomStyle.chatwindow}>
                <div className={RoomStyle.chat}>
                    {room.messages.map(message => {
                        return (
                            <Message
                                key={message._id}
                                msg={message}
                            />
                        );
                    })}
                    <div ref={msgEndRef}></div>
                </div>
                <div className={RoomStyle.message}>
                    <textarea
                        placeholder="Message"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                    />
                    <button
                        className={Style.btn}
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Room;
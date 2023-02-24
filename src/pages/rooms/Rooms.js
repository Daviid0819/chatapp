import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { DataContext } from "../../context/DataContext";

import RoomsStyle from "./Rooms.module.css";
import Style from "../../styles/style.module.css";

const Rooms = () => {
    const [roomname, setRoomname] = useState("");
    const [err, setErr] = useState("");

    const {name, setUserRoom} = useContext(DataContext);

    const navigate = useNavigate();

    useEffect(() => {
        if(name === ""){
            navigate("/");
        }
    }, []);

    const handleCreate = async() => {
        const res = await fetch("http://localhost:5000/room/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: roomname,
                user: name
            })
        });

        const data = await res.json();

        if(!data.success){
            return setErr(data.message);
        }

        setUserRoom(data.room);
        navigate("/room");
    };

    const handleEnter = async() => {
        const res = await fetch("http://localhost:5000/room/enter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: roomname,
                user: name
            })
        });

        const data = await res.json();

        if(!data.success){
            return setErr(data.message);
        }

        setUserRoom(data.room);
        navigate("/room");
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
        <div className={RoomsStyle.rooms}>
            <div className={Style.card}>
                <p>Welcome {name}!</p>
                <input
                    type="text"
                    className={Style.field}
                    placeholder="Room name"
                    value={roomname}
                    onChange={(e) => setRoomname(e.target.value)}
                />
                {handleError()}
                <div className={RoomsStyle.buttons}>
                    <button
                        className={Style.btn}
                        onClick={() => navigate("/")}
                    >
                        Back
                    </button>
                    <button
                        className={Style.btn}
                        onClick={handleEnter}
                    >
                        Enter room
                    </button>
                    <button
                        className={Style.btn}
                        onClick={handleCreate}
                    >
                        Create room
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Rooms;
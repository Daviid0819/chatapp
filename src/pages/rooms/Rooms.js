import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { DataContext } from "../../context/DataContext";

import RoomsStyle from "./Rooms.module.css";
import Style from "../../styles/style.module.css";

import ErrorMsg from "../../components/errormsg/ErrorMsg";

const Rooms = () => {
    const [roomname, setRoomname] = useState("");

    const {name, setUserRoom, err, setErr} = useContext(DataContext);

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

        setUserRoom(data.room.name);
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

        setUserRoom(data.room.name);
        navigate("/room");
    };

    const handleBack = () => {
        setErr("");
        navigate("/");
    };

    const handleError = () => {
        if(err !== ""){
            return <ErrorMsg />
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
                    onKeyDown={(e) => {
                        if(e.key === "Enter"){
                            handleEnter();
                        } 
                    }}
                />
                {handleError()}
                <div className={RoomsStyle.buttons}>
                    <button
                        className={Style.btn}
                        onClick={handleBack}
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
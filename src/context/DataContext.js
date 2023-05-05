import { useState, createContext } from "react";

export const DataContext = createContext();

export const StateProvider = ({ children }) => {
    const [name, setName] = useState("");
    const [userRoom, setUserRoom] = useState("");

    const [err, setErr] = useState("");

    const value = {
        name,
        setName,
        userRoom,
        setUserRoom,
        err,
        setErr
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
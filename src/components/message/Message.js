import { useContext } from "react";

import { DataContext } from "../../context/DataContext";

import MessageStyle from "./Message.module.css";

const Message = ({ msg }) => {
    const {name} = useContext(DataContext);

    return (
        <div className={MessageStyle.msg}>
            <div
                className={name === msg.name ? MessageStyle.msg_text_self : MessageStyle.msg_text}
            >
                <span>{msg.text}</span>
            </div>

            {name !== msg.name ? 
                <span style={{fontSize: "14px"}}>
                    From: {msg.name}
                </span>
            :
                <></>
            }
        </div>
    );
};

export default Message;
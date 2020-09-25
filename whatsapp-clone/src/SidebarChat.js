import { Avatar, IconButton } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ChatIcon from "@material-ui/icons/Chat";
import db from './firebase';
import './SidebarChat.css';
import { Link } from 'react-router-dom';

function SidebarChat({ id, name, addNewChat}) {
    const [seed, setSeed] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (id) {
            db.collection("rooms").doc(id).collection("messages")
             .orderBy("timestamp", "desc").onSnapshot((snapshot) => 
                 setMessages(snapshot.docs.map((doc) => doc.data()))
             );
        }
     }, [id]);

    useEffect(() => {
        // @ts-ignore
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    const createChat = () => {
        const roomName = prompt("Please enter the name for Chat Room");

        if (roomName) {
            db.collection('rooms').add({ 
                name: roomName,
            });
        }
    };

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
        <div className='sidebarChat'>
            <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
            <div className="sidebarChat__info">
                <h2>{name}</h2>
                <h6>{messages[0]?.message}</h6>
            </div>
        </div>
        </Link>
    ) : (
        <div onClick={createChat} className="sidebarAddChat">
            <IconButton>
                <ChatIcon/>
            </IconButton>
        </div>
    );
} 

export default SidebarChat

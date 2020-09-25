import React, { useEffect, useState } from 'react'
import { Avatar, IconButton } from '@material-ui/core'
import { AttachFile, InsertEmoticon, SearchOutlined} from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import MoreVertIcon from "@material-ui/icons/MoreVert"
import { useParams } from 'react-router-dom';
import './Chat.css'
import db from './firebase';
import { useStateValue } from './StateProvider';
import firebase from "firebase";

function Chat() {
    const [input, setInput] = useState("");
    const [seed, setSeed] = useState("");
    // @ts-ignore
    const { roomId } = useParams();
    const [ roomName, setRoomName ] = useState("");
    const [ messages, setMessages] = useState([]);
    const [ {user}, ] = useStateValue();


    useEffect(() => {
        if (roomId) {
            db.collection("rooms").doc(roomId).onSnapshot((snapshot) =>  
                setRoomName(snapshot.data().name));

            db.collection("rooms").doc(roomId).collection("messages").orderBy("timestamp", "asc").onSnapshot((snapshot) => (
                setMessages(snapshot.docs.map((doc) => doc.data()))
            ));
        }
    }, [roomId]);

    useEffect(() => {
        // @ts-ignore
        setSeed(Math.floor(Math.random() * 5000));
    }, [roomId]);

    const sendMessage = (e) => {
        e.preventDefault();
        console.log("you typed >>> ", input);
        db.collection("rooms").doc(roomId).collection("messages").add({
            message: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setInput("");
    };
    
    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat__headerInfo">
                    <h5>{roomName}</h5>
                    <h6>
                        last seen{" "}
                        {new Date(
                            messages[messages.length - 1]?.timestamp?.toDate()
                        ).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true})}
                    </h6>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">
                {messages.map(message => (
                    <div className="chat__messages">
                    {/* === user.displayName */}
                        <p className={` ${ message.name  ? "chat__receiver": "chat__sender"}`}>
                            <div className={` ${ message.name  ? "chat__receiverTail" : "chat__senderTail"}`}></div>
                            <span className="chat__name">
                                {message.name}
                            </span>
                            {message.message}
                            <span className="chat__timestamp">
                                {new Date(message.timestamp?.toDate()).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true})}
                            </span>
                        </p>
                
                    </div>
                ))}
            </div>
            <div className="chat__footer">
                <IconButton>
                    <InsertEmoticon />
                </IconButton>
                <IconButton>
                    <AttachFile />
                </IconButton>
                <form action="">
                    <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder=" Type a message" />
                    <button onClick={sendMessage} type="submit" >Send</button>
                </form>
                <IconButton>
                    <MicIcon />
                </IconButton>
            </div>
        </div>
    );
}

export default Chat

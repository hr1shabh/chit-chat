import { useState, useEffect } from 'react';
import ScroolToBottom from 'react-scroll-to-bottom';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css'
import InfoBar from './InfoBar';
import Input from './Input';
import Message from './Message';
let socket;
const ENDPOINT = 'localhost:4000'; //server location
const Chat = ({location}) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
 
useEffect(()=>{ //it will run when the new user enters or url changes
const {name, room} = queryString.parse(location.search);  //the data in url after chat/
console.log(location.search)
socket = io(ENDPOINT); //getting data from server
setName(name);
setRoom(room);

socket.emit('join', {name,room}, (error) =>{ //for passing events ,we can receive it
if(error) alert(error);
});  

return () =>{
  socket.emit('disconnect');
  socket.off();
}

},[ENDPOINT, location.search])//only if these two values changes

//console.log(message,messages);


const sendMessage = (event) =>{
event.preventDefault();
if(message)
socket.emit('sendMessage', message, ()=> setMessage('')); //sending msg to server and if it is sent then cleaning msg
}


useEffect(()=>{ //for handling messages from server side
  socket.on('message', (message) =>{
    setMessages([...messages,message]); //adding new msg to array
  })
},[messages]);


    return (
        <div className = "outerContainer">
        <div className="container">
        <InfoBar  room = {room}/>
        <ScroolToBottom className="flow">
        {messages.map((message,i) => <div key={i}><Message message = {message} name ={name} /></div>)}
        </ScroolToBottom>
        <Input message ={message} setMessage = {setMessage} sendMessage = {sendMessage} />
        </div>
        </div>
      );
}
//        <input value={message} onChange={(event) => setMessage(event.target.value)} onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}></input>
 
export default Chat;
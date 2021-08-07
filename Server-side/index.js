const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
// you cann;t use http req for real time chatting
// so we use web sockets instead
const app = express();
const {addUser, removeUser, getUser, getUserInRoom} = require('./users.js')

const port = 4000 || process.env.port;
const router = require('./router');

const server = http.createServer(app);
app.use(require('cors'));
corsOptions={
    cors: true,
    origins:["http://localhost:3000"],
   }
const io = socketIO(server,corsOptions);


io.on("connection",(socket)=>{
    console.log("New Connection");

    socket.on('join',({name,room},callback)=>{
        const {error,user} = addUser({ id: socket.id, name,room});
       // console.log(user);
        if(error) {return callback(error);} //username is already taken
        
        socket.emit('message', {user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});//for user only
        socket.broadcast.to(user.room).emit('message',{user: 'admin',text: `${user.name} has joined`});//for everybody except user
        socket.join(user.room); //joins user in that room
        
        io.to(user.room).emit('roomData',{room : user.room, users: getUserInRoom(user.room)})
        
        callback();

        });
        
        socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        console.log(socket.name);
        io.to(user.room).emit('message', {user: user.name, text: message});
        io.to(user.room).emit('roomData', {room: user.room,users: getUserInRoom(user.room)});
        callback();
        });

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',{user:'admin',text:`${user.name} has left`});
        }
    })
})



app.use(router);

server.listen(port,()=>{
console.log(`server is started on port ${ port }`); // always use `` when you pass js obj inside string
})
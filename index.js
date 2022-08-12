const express = require('express')
const {Server} = require('socket.io')
const cors = require('cors')

const PORT = process.env.PORT || 3005
const app = express()
app.use(cors())

// https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.1/socket.io.js
const srv = app.listen(PORT, console.log('listening on port: '+PORT))

const io = new Server(srv, {
  cors: {
    origin: '*'
  }
})
io.on('connection', client =>{
  console.log('new client connected! na porta ' +PORT)
})


// const io = require("socket.io")(PORT, {
//   cors: {
//     origin: "*",
//   },
// });

let users = []
const addUser = (userId, socketId)=>{
    !users.some(user=>user.userId == userId) && users.push({userId, socketId})
}
const removeUser = (socketId)=>{
    users = users.filter(user=>user.socketId != socketId)
}
const getUser = (userId)=>{
    return users.find(user=>user.userId == userId)
}
console.log(users)
io.on("connection", (socket) => {
    //when connect
  console.log("user connected na porta: " + PORT);
  //take userId and socketId from user
  socket.on('addUser', userId=>{
addUser(userId, socket.id)
io.emit("getUsers", users)
  })

  //send get message
  socket.on("sendMessage",({senderId, receiverId, text})=>{
const user = getUser(receiverId)
io.to(user.socketId).emit('getMessage',{
    senderId,
    text,
})
  })
  //when disconnect
socket.on('disconnect',()=>{
    console.log('use disconect')
    removeUser(socket.id)
})

});

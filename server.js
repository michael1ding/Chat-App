const io = require('socket.io')(3000) // server side
const users = {} // store user information


io.on('connection', socket =>{
    console.log('new User')
    socket.on('new-user', name=>{
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })
    socket.on("send-chat-message", message => {
        console.log(message)
        socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]}) // send message with name
    })
    socket.on("disconnect", () =>{ // user leave message
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})


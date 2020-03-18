const users = {} // store user information
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server) // start socketio
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true})) // use url as form

const rooms = {} // chat rooms

// On Going to Homepage
app.get('/', (request, response) =>{
    response.render('index', {rooms: rooms})
})

// On Entering a Chatroom
app.get('/:room', (request, response) =>{
    if(rooms[request.params.room] == null) { // if room does not exist
        return response.redirect('/')
    }
    response.render('room', {roomName: request.params.room})
}) // set room names

// On Creating a New Chatroom
app.post('/room', (request, response) => {
    if(rooms[request.body.room] != null){ // room already created
        return response.redirect('/')
    }
    rooms[request.body.room] = {users: {}}
    response.redirect(request.body.room)
    // show new room created
    io.emit('room-created', request.body.room)
})

server.listen(3000)

// On Connection to Server
io.on('connection', socket =>{
    console.log('new User') // user enter
    socket.on('new-user', (room,name)=>{
        socket.join(room) // send user into joined room
        rooms[room].users[socket.id] = name // add user to a specific chat room's users
        socket.to(room).broadcast.emit('user-connected', name)
    })
    socket.on("disconnect", () =>{ // user leave message
        getUserRooms(socket).forEach(room => { // delete from all current rooms
            socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
            delete rooms[room].users[socket.id]
        })
    })

    socket.on("send-chat-message", (room, message) => {
        console.log(message)
        socket.to(room).broadcast.emit('chat-message', {message: message, name: rooms[room].users[socket.id]}) // send message with name
    })

    
})

function getUserRooms(socket){ // check room names for a user 
    return Object.entries(rooms).reduce((names, [name, room]) => {
        if (room.users[socket.id] != null){
            names.push(name)
        }
        return names
    }, [])
}

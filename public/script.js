const socket = io('http://localhost:3000') // link socket host
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input') // capture message form
const roomContainer = document.getElementById('room-container')


if (messageForm != null){ // only run code on messages landing page
    const name = prompt('Please enter your nickname:')
    appendMessage(name + ' entered the server!')
    socket.emit('new-user', roomName, name)
    // Send messages
    messageForm.addEventListener('submit', e=> {
    e.preventDefault()
    const message = messageInput.value
    socket.emit('send-chat-message', roomName, message)
    messageInput.value = ''
    appendMessage("You: "+message)
})
}




// Send Chats
socket.on('chat-message', data =>{
    appendMessage(data.name+": "+data.message)
})

// Broadcast user joined
socket.on('user-connected', name =>{
    appendMessage(name + ' connected to the chatroom!')
})

// Broadcast user left
socket.on('user-disconnected', name =>{
    appendMessage(name + ' disconnected from the chatroom!')
})

// On room creation
socket.on('room-created', room =>{
    const roomElement = document.createElement('h5')
    const roomLink = document.createElement('a')
    const subtitle = document.createElement('p')
    roomElement.innerText = room
    roomLink.href ="/"+room
    roomLink.innerText='Join Chatroom'
    subtitle.innerText="Chat Room"
    roomContainer.append(roomElement)
    roomContainer.append(subtitle)
    roomContainer.append(roomLink)
})

// update message-container
function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}
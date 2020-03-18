const socket = io('http://localhost:3000') // link socket host
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container') // capture message form
const messageInput = document.getElementById('message-input')

const name = prompt('Please enter your nickname:')
appendMessage(name + ' entered the server!')
socket.emit('new-user', name)

// Send Chats
socket.on('chat-message', data =>{
    appendMessage(data.name+": "+data.message)
})

// Broadcast user joined
socket.on('user-connected', name =>{
    appendMessage(name + ' connected to the server!')
})

// Broadcast user left
socket.on('user-disconnected', name =>{
    appendMessage(name + ' disconnected from the server!')
})

messageForm.addEventListener('submit', e=> {
    e.preventDefault()
    const message = messageInput.value
    socket.emit('send-chat-message', message)
    messageInput.value = ''
    appendMessage("You: "+message)
})

function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}
const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#message').addEventListener('submit', (e) => {
    e.preventDefault()
})
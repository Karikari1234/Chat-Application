const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/message.js')

const app = express()

const server = http.createServer(app)
const io = socketio(server)



io.on('connection', (socket) => {
    console.log('New User Connected')
    socket.emit('message', generateMessage('Welcome!'))

    socket.broadcast.emit('enterMessage', 'A new User has joined the chat')

    socket.on('sendMessage', (message, callback) => {
        io.emit('message', generateMessage(message))
        callback('delivered')
    })

    socket.on('disconnect', () => {
        io.emit('exitMessage', 'A user has left the chat')
    })

    socket.on('location', (location, callback) => {
        socket.broadcast.emit('locationMessage', generateLocationMessage(location))
        callback('Shared!')
    })

})
const port = process.env.PORT || 6060

const publicDirectory = path.join(__dirname, '../public')

app.use(express.static(publicDirectory))

server.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})


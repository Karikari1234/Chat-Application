const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()

const server = http.createServer(app)
const io = socketio(server)



io.on('connection', (socket) => {
    console.log('New User Connected')
    socket.emit('message', 'Welcome!')

    socket.on('increment', () => {
        count++
        io.emit('countUpdated', count)
    })

})
const port = process.env.PORT || 6060

const publicDirectory = path.join(__dirname, '../public')

app.use(express.static(publicDirectory))

server.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})


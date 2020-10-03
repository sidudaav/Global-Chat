const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const Filter = require('bad-words')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

io.on('connection', socket => {
    io.emit('changedTotalSockets', {
        connected: Object.keys(io.sockets.connected).length
    }

    )
    io.to(socket.id).emit('connected', {
        id: socket.id,
        username: uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] })
    })

    socket.on('message', data => {
        const filter = new Filter()
        io.emit('message', {
            id: socket.id,
            msg: filter.clean(data.msg),
            username: data.username
        })
    })

    socket.on('disconnect', () => {
        io.emit('changedTotalSockets', {
            connected: Object.keys(io.sockets.connected).length
        })
    })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, console.log(`Server is running on port ${PORT}`))
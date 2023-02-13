const http = require('http')
const socketIo = require('socket.io')

const PORT = process.env.PORT || 3000

const server = http.createServer((req,res) => {
  res.write('ok')
  res.end()
})

const io = socketIo(server, {
  cors: {
    origin: '*',
    credentials: false
  }
})
const rooms = []
io.on('connect', (socket) => {
  socket.on('join_room', (username, room, cb) => {
    console.log(`[${socket.id}] joined the room [${room}]`);
    socket.join(room)
    cb()
  })
  socket.on('send_message', (data, cb) => {
    data.createdAt = new Date()
    console.log(`message received from [${socket.id}]`, data);
    io.to(data.room).emit('received_message', data)
    // io.sockets.emit('received_message', data)
    cb()
  })
})

server.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
})

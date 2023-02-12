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
io.on('connect', (socket) => {
  console.log(`Someone connected: ${socket.id}`);
  socket.on('user:message-send', (message) => {
    socket.broadcast.emit('user:message-received', {
      id:socket.id,
      message: message,
      room: null,
      createdAt: new Date()
    })
  })
})

server.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
})
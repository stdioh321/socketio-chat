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
  console.log(`Someone connected: ${socket.id}`);
  socket.on('user:message-send', (message, rooms = [], cb) => {
    const data = {
      id:socket.id,
      message: message,
      room: rooms,
      createdAt: new Date()
    };
    if(rooms.length){
      socket.emit('user:message-received', data)
      rooms.forEach(it=>{
        socket.to(it).emit('user:message-received', data)
      })
    }
    else
      io.emit('user:message-received', data)

    cb()
  })
  socket.on('user:room-join', (room, cb = ()=>{}) => {
    if(!room) return
    room = room.toLowerCase()
    socket.join(room)
    socket.emit('user:room-joined', room)
    cb()
  })
  socket.on('user:room-leave', (room, cb) => {
    if(!room) return
    room = room.toLowerCase()
    socket.leave(room)
    cb()
  })
})

server.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
})
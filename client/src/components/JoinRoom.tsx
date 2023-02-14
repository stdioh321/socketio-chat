import { useState } from "react"
import './JoinRoom.css'

export default function JoinRoom(props) {
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const { socket } = props

  const onSend = () => {
    if(!username || !room) return
    socket.emit('join_room', username, room, () => {
      console.log(`user [${username}] joined the room [${room}]`);
      props.setUser({username,room})
    })
  }
  return <div  className="join-container">
      <div className="join-wrapper">
        <h3 className="mb-3">Chat</h3>
        <input type="text" className="form-control mb-2" placeholder="Username" value={username} onInput={(event)=>setUsername(event.target.value)} />
        <input type="text" className="form-control mb-2" placeholder="Room" value={room} onInput={(event)=>setRoom(event.target.value)} />
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary px-4" onClick={onSend} disabled={!username || !room}>Send</button>
        </div>
      </div>
  </div>
}
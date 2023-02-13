import { useState } from "react"

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
  return <div>
      <h3>Chat</h3>
      <input type="text" className="form-control mb-2" placeholder="Username" onInput={(event)=>setUsername(event.target.value)} />
      <input type="text" className="form-control mb-2" placeholder="Room"  onInput={(event)=>setRoom(event.target.value)} />
      <button className="btn btn-primary" onClick={onSend}>Send</button>
  </div>
}
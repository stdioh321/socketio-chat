import { useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import './App.css'
import MessageDto from './MessageDto'
import Message from './components/Message'
const ioClient = io('http://localhost:3000',{
  withCredentials: false
})

let staticMessages = []
let staticRooms: string[] = []
function App() {

  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('');
  const [rooms, setRooms] = useState<string[]>([]);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const updateMessages = (message: MessageDto) => {
    if(!message) return
    const tempMessages = [...messages, message];
    staticMessages = [...tempMessages]
    setMessages(staticMessages);
  }
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };
  const handleRoomChange = (event) => {
    setRoom(event.target.value);
  };
  const handleLeaveRoom = (room) => {
    ioClient.emit('user:room-leave', room, () => {
      console.log(`${ioClient.id} leave room: ${room}`);
      staticRooms = staticRooms.filter(it=>!it==room)
      setRooms([...staticRooms])
    })
  };
  const onSendMessage = (ev) => {
    ev.preventDefault()
    if(!message) return;
    setSendingMessage(true)
    ioClient.emit('user:message-send', message, rooms, () => {
      setMessage('');
      setSendingMessage(false)
    });
    
  };
  
  const onSendRoom = (ev) => {
    ev.preventDefault()
    if(!room) return;
    ioClient.emit('user:room-join', room);
  };

  useEffect(() => {
    ioClient.on('connect', () => {
      // console.log(`socket connect: ${ioClient.id}`);
    })
    ioClient.on('user:connect', () => {
      console.log(`socket connect: ${ioClient.id}`);
    })

    ioClient.on('user:message-received', (msg:MessageDto) => {
      console.log(`id: ${msg.id} -> message: ${msg.message}`);
      updateMessages(msg)
    })
    ioClient.on('user:room-joined', (room:string) => {
      if(staticRooms.includes(room)) return
      console.log(`${ioClient.id} joined room: ${room}`);
      staticRooms = [...staticRooms, room]
      setRooms([...staticRooms])
    })


    return () => {
      ioClient.off('connect')
      ioClient.off('disconnect')
      ioClient.off('user:message-received')
      ioClient.off('user:room-joined')
      ioClient.off('user:room-leave')
    }
  },[messages])
  return (
    <div className="App container">
      <div className="row">
        <div className="col-12">
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4 className='d-flex justify-content-between'>
          <span>Connected: {ioClient.connect ? 'true' : 'false'}</span>
          <span hidden={ioClient?.id}>id: {ioClient?.id}</span>
          </h4>
          <div className="chat-wrapper">
            <div className="chat-messages-wrapper">
              <div className="chat-messages">
                { messages.map((it,idx) => {
                  return <div className='ml-1 mb-2' key={idx}>
                    <Message id={it.id} message={it.message} room={it.room} me={ioClient.id === it.id} createdAt={it.createdAt} />
                  </div>
                })}
              </div>
            </div>
            <div className="chat-inputs-wrapper mt-2">
              <div className="chat-input-message">
                <form className="row gx-1" onSubmit={onSendMessage}>
                  <div className="col-md-9 col-7">
                    <textarea rows="2" className='form-control' placeholder='Type your message' type="text" value={message} onInput={handleMessageChange}></textarea>
                  </div>
                  <div className="col-md-3 col-5">
                    <button className="btn btn-primary btn-block w-100" disabled={!message || sendingMessage}>Send message</button>
                  </div>
                </form>
                <form className="row gx-1 mt-2" action='' onSubmit={onSendRoom}>
                  <div className="col-md-9 col-7">
                    <input className='form-control' placeholder='Type your room' type="text" value={room} onInput={handleRoomChange} />
                  </div>
                  <div className="col-md-3 col-5">
                    <button className="btn btn-warning btn-block w-100" type='submit' disabled={!room || rooms.includes(room)} >Join room</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">

          <div className={rooms.length  ? null: 'd-none'}>
            <h3>Rooms you are in</h3>
            <div>
            {
              rooms.map((it,idx)=>{
                return (<div className='d-flex justify-content-between' key={idx}>
                  <div>{it}</div>
                  <div>
                    <button className="btn btn-danger" onClick={()=>handleLeaveRoom(it)}>&otimes;</button>
                  </div>
                </div>)
              })
            }
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

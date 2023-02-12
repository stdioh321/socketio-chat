import { useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import './App.css'
import MessageDto from './MessageDto'
import Message from './components/Message'
const ioClient = io('http://localhost:3000',{
  withCredentials: false
})

let staticMessages = []
function App() {
  const [message, setMessage] = useState('');
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
  const onSendMessage = (ev) => {
    ioClient.emit('user:message-send', message);
    updateMessages({
      id: ioClient.id,
      message: message,
      room: undefined,
      createdAt: new Date()
    });
    setMessage('');
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


    return () => {
      ioClient.off('connect')
      ioClient.off('disconnect')
      ioClient.off('user:message-received')
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
                <div className="row gx-1">
                  <div className="col-md-9 col-7">
                    <input className='form-control' placeholder='Type your message' type="text" value={message} onInput={handleMessageChange} />
                    </div>
                  <div className="col-md-3 col-5">
                    <button className="btn btn-primary btn-block w-100" onClick={onSendMessage} disabled={!message}>Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

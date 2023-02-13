import moment from 'moment'
import { useEffect, useState } from 'react';
import MessageDto from '../MessageDto';
import Message from './Message';
import './Chat.css';
export default function Chat(props) {
  const {socket, user} = props

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageDto[]>([]);

  useEffect(()=>{
    socket.on('received_message', (data) => {
      console.log('received_message', data);
      setMessages((list) => [...list, data])
    })
    return () => {
      socket.off('received_message')
    }
  },[])
  const onSendMessage = (event)=>{
    event.preventDefault();
    if(!message) return
    const messageDto = new MessageDto()
    messageDto.id = socket.id;
    messageDto.message = message;
    messageDto.room = user.room;
    messageDto.username = user.username;

    socket.emit('send_message', messageDto, () => {
      console.log('Message sent');
      setMessage('')
    })
  }
  return <div>
    <div className="chat-container">
      <div className="chat-header">
        <h4 className='d-flex justify-content-between'>
          <div>user: {user?.username}</div>
          <div>room: {user?.room}</div>
        </h4>
      </div>
      <div className="chat-body">
        {messages.map( (it, idx) => {
          return <div key={idx} className={`${it.id === socket.id ? 'me' : 'other'}`}>
            <Message data={it} socket={socket} />
          </div>
        })}
      </div>
      <div className="chat-footer mt-1">
      <form className="row" onSubmit={onSendMessage}>
      <div className="col-md-9 col-8">
        <input type="text" className='form-control' placeholder='your message....' value={message}
        onInput={(event)=>setMessage(event.target.value)}
        />
      </div>
      <div className="col-md col-4">
        <button className="btn btn-primary w-100" disabled={!message}>Send</button>
      </div>
      </form>
      </div>
    </div>
  </div>
}
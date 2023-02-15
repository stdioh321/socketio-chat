import moment from 'moment'
import { useEffect, useRef, useState } from 'react';
import MessageDto from '../MessageDto';
import Message from './Message';
import './Chat.css';
export default function Chat(props) {
  const chatBody = useRef(null);

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
  const onSendMessage = ( event )=>{
    event.preventDefault();
    if(!message?.trim()) return
    const messageDto = new MessageDto()
    messageDto.id = socket.id;
    messageDto.message = message;
    messageDto.room = user.room;
    messageDto.username = user.username;

    socket.emit('send_message', messageDto, () => {
      console.log('Message sent');
      setMessage('')
      chatBody.current?.scrollTo(0, chatBody.current?.scrollHeight);
    })
  }

  const onLeave = ()=>{
    props.setUser(null)
  }

  return <div>
    <div className="chat-container">
      <div className="chat-header">
        <h4 className='d-flex justify-content-between'>
          <div>user: {user?.username}</div>
          <div>room: {user?.room}</div>
        </h4>
      </div>
      <div className="chat-body" ref={chatBody}>
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
      <div className="row mt-3">
        <div className="offset-md-9 col-md-3 offset-8">
          <button className="btn btn-danger w-100" onClick={onLeave}>Leave</button>
        </div>
      </div>
      </div>
    </div>
  </div>
}
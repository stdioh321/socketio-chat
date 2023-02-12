import './Message.css'

export default function Message(props) {
  const {id, message, room, me=false} = props
  return <div className={`message-wrapper ${me ? 'me' : ''}`} >
    <div className="content">
      <div hidden={me} className='user'>{me ? 'you': id}</div>
      <div className='message'>{message}</div>
    </div>
  </div>
}
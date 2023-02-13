import MessageDto from "../MessageDto"
import { toFormatedDate } from "../Utils"
import './Message.css'

export default function Message(props){
  const { socket } = props
  const data: MessageDto = props.data
  const isYou: boolean = data.id === socket.id ? true : false
  
  return <div className={`message-container ${isYou === true ? 'you' : 'other'}`}>
    <div className={`message-wrapper `}>
      <div className="message-header">{isYou === true  ? '' : data.username}</div>
      <div className="message-body">{data.message}</div>
      <div className="message-footer">
        <div className="room">{data.room}</div>
        <div className="created-at">
          {toFormatedDate(data.createdAt)}
        </div>
      </div>
    </div>
  </div>
}
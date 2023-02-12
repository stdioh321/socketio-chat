import './Message.css'
import moment from 'moment'
export default function Message(props) {
  const {id, message, room, me=false, createdAt} = props
  let theDate
  if(createdAt) theDate = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')

  return <div className={`message-wrapper ${me ? 'me' : ''}`} >
    <div className="content">
      <div hidden={me} className='user'>{me ? 'you': id}</div>
      <div className='message'>{message}</div>
      <div className='created-at'>{theDate || ''}</div>
    </div>
  </div>
}
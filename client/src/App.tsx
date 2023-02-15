import { createRef, useCallback, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import './App.css'
import JoinRoom from './components/JoinRoom'
import Chat from './components/Chat'

const ioClient = io('http://localhost:3000',{
  withCredentials: false
})

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {

  },[user])
  return (<div className='container'>
    <div className="row">
      {!user && (<div  className={`col-md-8 offset-md-2`}>
        <JoinRoom socket={ioClient} setUser={setUser} />
      </div>)}
      {user && (<div  className={`col-md-8 offset-md-2`}>
        <Chat socket={ioClient} user={user} setUser={setUser} />
      </div>)}
    </div>
  </div>)
}

export default App

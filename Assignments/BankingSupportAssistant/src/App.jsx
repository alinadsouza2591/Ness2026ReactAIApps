import { useState } from 'react'
import Chatbot from './chatbot'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Chatbot />
    </>
  )
}

export default App

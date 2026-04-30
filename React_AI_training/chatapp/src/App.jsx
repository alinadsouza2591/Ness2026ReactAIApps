import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
//import './App.css'
import Login from './Login'   
import Search from './Search'
import MyChat from './MyChat'
import NewDashboard from './NewDashboard'
import QuickChat from './QuickChat'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <QuickChat />
    </>
  )
}

export default App

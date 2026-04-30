// generate a login page with tailwind css and react
// if username and password is not empty then show
//test box for chat app, else show error message
import { useState } from 'react'
import ChatBox from './Search'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    if (username && password) {
      // Show chat box
      setError('')
      setIsLoggedIn(true)
    } else {
      // Show error message
      setError('Username and password cannot be empty')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {isLoggedIn ? (
        <ChatBox />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Login
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
      )}
    </div>
  )
}

export default Login
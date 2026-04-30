// create a compoinent named QuickChat  this will have personas while chatting
// with the use and send system prompt to the api for better response, also include retry logic with backoff and error handling
// use the sendMessage function from newapicall.js to send the message to the api and get the response, also include a loading state and error state to show the user when the message is being sent and when there is an error
// also include a clear response button to clear the response from the screen, and also add some styling to the component
// generate the code with proper inlince css , which gives a pretty looking ui
//  keep buttons be like this "you are a kid" , "generate reponse in 3 bullet points" , "provide  a 5 line summary", "joke of the day"
// depending on the button clicked the system prompt will change and the response will be generated accordingly, also include a text input for custom system prompt and a button to send the custom system prompt as wellth the use and send system prompt to the api for better response, also include retry logic with 

import { useState } from 'react'
import { sendMessage } from './newapicall'

function QuickChat() {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')

  const handleButtonClick = async (prompt) => {
    setLoading(true)
    setError('')
    setResponse('')

    try {
      const result = await sendMessage(prompt)
      if (result.success) {
        setResponse(result.data)
      } else {
        setError(result.error || 'Unknown error occurred')
      }
    } catch (err) {
      setError('Failed to send message. Please try again.')
      console.error('Error sending message:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Quick Chat</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={() => handleButtonClick('You are a kid')} style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px' }}>
          You are a kid
        </button>
        <button onClick={() => handleButtonClick('Generate response in 3 bullet points')} style={{ padding: '10px', backgroundColor: '#28A745', color: '#fff', border: 'none', borderRadius: '5px' }}>
          Generate response in 3 bullet points
        </button>
        <button onClick={() => handleButtonClick('Provide a 5 line summary')} style={{ padding: '10px', backgroundColor: '#17A2B8', color: '#fff', border: 'none', borderRadius: '5px' }}>
          Provide a 5 line summary
        </button>
        <button onClick={() => handleButtonClick('Joke of the day')} style={{ padding: '10px', backgroundColor: '#FFC107', color: '#fff', border: 'none', borderRadius: '5px' }}>
          Joke of the day
        </button>
        <input
          type="text"
          placeholder="Enter custom system prompt"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <button onClick={() => handleButtonClick(customPrompt)} style={{ padding: '10px', backgroundColor: '#6C757D', color: '#fff', border: 'none', borderRadius: '5px' }}>
          Send Custom Prompt
        </button>
      </div>
      {loading && <p style={{ marginTop: '20px', color: '#007BFF' }}>Loading...</p>}
      {error && <p style={{ marginTop: '20px', color: '#DC3545' }}>{error}</p>}
      {response && <pre style={{ marginTop: '20px', backgroundColor: '#F8F9FA', padding: '10px', borderRadius: '5px' }}>{response}</pre>}
    </div>
  )
}

export default QuickChat
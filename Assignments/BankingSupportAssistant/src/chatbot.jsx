// create a chatbot that acts as a banking assistant, 
// Be safe and non-sensitive 
// Avoid giving financial advice blindly 
// Example behaviour: Explain transactions, Suggest next steps, Ask for clarification when needed
//usestate to manage the conversation history and user input
// store the conversation history
//create a loading indicator while waiting for the response from the API
//disablebutton while waiting for the response
//autoscroll messages
//handle edge cases like empty user input, very long user input, multiple messages in a row without waiting for response, etc.
//style the chatbot with css, make it look nice and user friendly

import { useState, useEffect, useRef } from 'react'
import { generateContent } from './api'
import './chatbot.css'

const MAX_INPUT_LENGTH = 1200

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content:
        'You are a banking customer support assistant. Rules: Do not provide financial advice. Explain transactions clearly. Suggest safe next steps. Be concise, professional, and non-sensitive. Ask for clarification when needed.'
    }
  ])
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })
  }, [messages, loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const trimmedInput = userInput.trim()
    if (!trimmedInput) {
      setError('Please enter a question or transaction detail.')
      return
    }

    const userMessage = { role: 'user', content: trimmedInput }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setUserInput('')
    setError(null)
    setLoading(true)

    try {
      const response = await generateContent(updatedMessages)
      if (!response || !response.trim()) {
        throw new Error('Empty response from the assistant. Please try again.')
      }

      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: response.trim() }
      ])
    } catch (err) {
      setError(err.message || 'Sorry, something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Banking Support Assistant</div>

      <div className="chatbot-messages">
        {messages
          .filter((msg) => msg.role !== 'system')
          .map((msg, index) => (
            <div
              key={index}
              className={`chatbot-message ${msg.role === 'assistant' ? 'assistant' : 'user'}`}
            >
              <div className="message-content">{msg.content}</div>
            </div>
          ))}

        {loading && (
          <div className="chatbot-message assistant">
            <div className="message-content">Thinking...</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && <div className="chatbot-error">{error}</div>}

      <form onSubmit={handleSubmit} className="chatbot-input-row">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask me anything about your banking needs..."
          disabled={loading}
          rows={3}
          maxLength={MAX_INPUT_LENGTH}
        />
        <div className="chatbot-controls">
          <span className={`char-count ${userInput.length > 1000 ? 'warning' : ''}`}>
            {userInput.length}/{MAX_INPUT_LENGTH}
          </span>
          <button type="submit" disabled={loading || !userInput.trim()}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}
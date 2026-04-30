// generate ChatTwo component
//get response from genContent from googleApi and rendering it in a chat interface
// i want AI returns markdown — render it properly, not as raw text.
// get the outcome of the response and render it in a chat interface
//  with user messages on the right side and AI responses on the left.
// maintain a conversation history and display it in the chat interface.
// use useState to maintain the conversation history and display it in the chat interface.
// make the UI colorful and attractive using CSS, and ensure it's responsive for different screen sizes.

import React, { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { generateContent } from './googleApi'
import Errorhandler from './Errorhandler'
import './ChatTwo.css'

function ChatTwo() {
  const [conversation, setConversation] = useState(() => {
    if (typeof window === 'undefined') return []
    const stored = window.localStorage.getItem('chatTwoConversation')
    return stored ? JSON.parse(stored) : []
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    window.localStorage.setItem('chatTwoConversation', JSON.stringify(conversation))
  }, [conversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  const handleGenerateContent = async () => {
    if (!query.trim()) return
    setLoading(true)
    setErrorMessage('')
    try {
      const result = await generateContent(query)
      setConversation(prev => [...prev, { role: 'user', content: query }, { role: 'ai', content: result }])
      setQuery('')
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            setErrorMessage('Resource not found (404). Please check your request.')
            break
          case 401:
            setErrorMessage('Unauthorized (401). Please check your API key and permissions.')
            break
          case 403:
            setErrorMessage('Forbidden (403). You do not have access to this resource.')
            break
          case 409:
            setErrorMessage('Conflict (409). There is a conflict with your request. Please try again.')
            break
          case 429:
            setErrorMessage('Too Many Requests (429). You have exceeded your rate limit. Please try again later.')
            break
          default:
            setErrorMessage(`Error ${error.response.status}: ${error.response.data}`)
        }
      } else {
        setErrorMessage('An error occurred while fetching content. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setErrorMessage('')
  }

  return (
    <div className="chat-two">
      <div className="chat-header">
        <div>
          <h2>AI Chat</h2>
          <p>Markdown-friendly conversation history with persisted messages.</p>
        </div>
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={handleGenerateContent} disabled={loading || !query.trim()}>
          {loading ? 'Generating...' : 'Send'}
        </button>
      </div>

      <Errorhandler errorMessage={errorMessage} clearError={clearError} />

      <div className="conversation">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.role === 'ai' ? (
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            ) : (
              msg.content
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default ChatTwo
// create a component named ChatFirst , which calls the generateContent function and pass the content as a prop to the component. The component should render the content in a div with a class name of chat-first.
// The component should also have a button that when clicked, calls the generateContent function
// if there are error , it should be displayed in the Errorhandler component
// handle error codes for 404,401,403,409, with proper error message
// make the ui colourful and attractive and responsive using css
// make fallback for error handling and loading state ,
// display the loading state when the content is being generated and hide it when the content is generated or when there is an error
// i need a textbox to get input message from the user and pass to the generateContent function and display the response in the content div
import React, { useState } from 'react' 
import { generateContent } from './googleApi'
import Errorhandler from './Errorhandler'
//import './ChatFirst.css'

function ChatFirst() {
  const [content, setContent] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  const handleGenerateContent = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const result = await generateContent(query)
      setContent(result)
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
    <div className="chat-first">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Type your message here..."
      />
      <button onClick={handleGenerateContent} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Content'}
      </button>
      {content && <div className="content">{content}</div>}
      <Errorhandler errorMessage={errorMessage} clearError={clearError} />
    </div>
  )
}

export default ChatFirst
// read newapicall.js use sendMessage function and
// design a UI, which takes user input based on system prompting and the parameters of sendMaessage
//display the response based on the response strudture returned by sendMessage function
//handle loading state and error state in the UI
//use clean code and modular approach, seperate concerns into differnt functions if nedded
//need css selectors for styling the ui is using dashboard.css file
//make use of the usestate hook and useEffect hook if needed for managing state and side effect
// ensure that response rendering is optimized and does not cause unnecessary re-renders

import { useState } from 'react'    
import { sendMessage } from './newapicall'
import './dashboard.css'


function NewDashboard() {
    const [query, setQuery] = useState('')
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSendMessage = async () => {
        if (!query.trim()) {
            return
        }

        setLoading(true)
        setError('')
        setResponse(null)

        try {
            const result = await sendMessage(query)
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
        <div className="dashboard-container">
            <h1 className="dashboard-title">New Dashboard</h1>
            <div className="input-section">
                <input
                    type="text"
                    placeholder="Enter your message"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="dashboard-input"
                />
                <button
                    onClick={handleSendMessage}
                    className="dashboard-button"
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </div>
            <div className="response-section">
                {error && <p className="error-message">{error}</p>}
                {response && (
                    <div className="response-container">                    
                        <pre className="response-content">
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NewDashboard
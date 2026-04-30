//create a MyChat component that renders a chat interface
//which can call the googleApi generateContent method from googleApi.js to get the search results and display them in the chat interface

import { useState } from 'react'
import { generateContent } from './googleApi'

function MyChat() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState(null)    

    const handleSearch = async () => {
        if (!query.trim()) {
            return
        }

        try {
            const text = await generateContent(query)
            setResults(text)
        } catch (error) {
            console.error('Error fetching search results:', error)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">My Chat</h1>
            <input
                type="text"
                placeholder="Enter search query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mb-2 p-2 border border-gray-300 rounded"
            />
            <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Search
            </button>
            <div className="mt-4 w-full max-w-md">
                {results ? (
                    <div className="bg-gray-200 p-4 rounded whitespace-pre-wrap break-words">
                        {results}
                    </div>
                ) : (
                    <p className="text-gray-500">No results yet. Enter a query and click Search.</p>
                )}
            </div>
        </div>
    )
}

export default MyChat
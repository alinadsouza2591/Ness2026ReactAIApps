// generate a code to get the search query from user
// and provide results in json format
// use the shared googleApi helper for Gemini
import { useState } from 'react'
import { generateContent } from './googleApi'

function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!query.trim()) {
      return
    }

    try {
      setError('')
      const response = await generateContent(query)
      setResults(response)
    } catch (error) {
      setError('Failed to fetch search results.')
      console.error('Error fetching search results:', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
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
          <pre className="bg-gray-200 p-4 rounded overflow-x-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">No results found</p>
        )}
      </div>
    </div>
  )
}

export default Search
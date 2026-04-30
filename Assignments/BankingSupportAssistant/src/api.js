// i need to design this class in which i will use axios and make a call to llm model using api call
// we need to pass user query as a prompt to the llm model and get the response and display it to the user
// url and model is MODEL_NAME = 'gemini-3-flash-preview'
// API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`
//handle errors 401 invalid api key, 429 rate limit exceeded, 500 internal server error, empty response from API, network errors

import axios from 'axios'

const API_KEY = 'AIzaSyD9gL0vSBlRdv7mD-O3Y0tlO1H3-9DcEuY'
const MODEL_NAME = 'gemini-3-flash-preview'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

const getErrorMessage = (error) => {
  if (error.response) {
    const status = error.response.status
    if (status === 401) return 'Invalid API key. Please check your credentials.'
    if (status === 429) return 'Rate limit exceeded. Please try again in a moment.'
    if (status >= 500) return 'Server error. Please try again later.'

    const serverMessage =
      error.response.data?.error?.message || error.response.statusText
    return serverMessage
      ? `API error: ${serverMessage}`
      : 'Unexpected API response. Please try again.'
  }

  if (error.request) {
    return 'Network error. Please check your connection.'
  }

  return error.message || 'Unknown error occurred.'
}

export const generateContent = async (messages) => {
  try {
    const contents = messages.map((msg) => ({
      role: msg.role,
      parts: [
        {
          text: msg.content
        }
      ]
    }))

    const response = await axios.post(
      API_URL,
      { contents },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    const candidate = response.data?.candidates?.[0]
    const text =
      candidate?.content?.parts?.[0]?.text ?? candidate?.content?.text ?? ''

    if (!text || !text.trim()) {
      throw new Error('Empty response from assistant. Please try again.')
    }

    return text.trim()
  } catch (error) {
    const message = getErrorMessage(error)
    console.error('Error generating content:', error.response?.data || error.message)
    throw new Error(message)
  }
}
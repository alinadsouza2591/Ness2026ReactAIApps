// Generate JSON response from Google Gemini API
// Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent
// Uses axios

import axios from 'axios'

const apiKey = "AIzaSyAb_oaY3b_rHmIO6xqTyd4R4XV5onsEYSw"
const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export const generateContent = async (
  query,
  latLng = { latitude: 34.050481, longitude: -118.248526 }
) => {
  if (!apiKey) {
    console.error('apikey is not defined. Set the apiKey variable in googleApi.js.')
    throw new Error('Missing API key')
  }

  if (!query || !query.trim()) {
    throw new Error('Query is required')
  }

  try {
    const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: query
              }
            ]
          }
        ],
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        }
      }
    )

    const data = response.data
    console.log('API response:', data?.candidates?.[0]?.content?.parts?.[0]?.text)
    const text =
      data?.parts?.[0]?.text ||
      data?.contents?.[0]?.parts?.[0]?.text ||
      data?.output?.[0]?.content?.[0]?.text ||
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      JSON.stringify(data)

    return text
  } catch (error) {
    if (error.response) {
      console.error('API error response:', error.response.status, error.response.data)
    } else {
      console.error('Error fetching search results:', error)
    }
    throw error
  }
}




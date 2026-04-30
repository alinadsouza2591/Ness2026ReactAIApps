// need function named sendMessage which takes message and retries as parameters and returns,
// it need s to use axio call and uses gemini 1.5-flash or 2.5 flash , and call
// the api https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`
//  convert the chat message into gemini "contents" format and send the request to google api and return the response
//  include system prompt for assitant behaviour
// implement rtry logic  with backoff, handle errors 400 series with proper message
// return structure response { success: boolean, data: string, error: string }
// extract response from candidates[0].content.parts[0].text
// use a clean code and modular approach, separate concerns into different functions if needed

import axios from 'axios'

const apiKey = "AIzaSyDj-oVQGDtcwasH-spL2Z1S_T4_sMgPJoU"
const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export const sendMessage = async (message, retries = 3) => {
  if (!apiKey) {
    console.error('apikey is not defined. Set the apiKey variable in googleApi.js.')
    return { success: false, data: null, error: 'Missing API key' }
  }

  if (!message || !message.trim()) {
    return { success: false, data: null, error: 'Message is required' }
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
                text: message
              }
            ]
          }
        ],
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: 34.050481, longitude: -118.248526 }
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        timeout: 10000 // 10 seconds timeout    
         }  
        )
        .catch(async (error) => {
          if (error.response) {
            console.error('API error response:', error.response.status, error.response.data)
            if (error.response.status >= 500 && retries > 0) {
              // Retry on server errors with exponential backoff
              const backoffTime = (4 - retries) * 1000 // 1s, 2s, 3s
              console.log(`Retrying in ${backoffTime / 1000} seconds...`)
              await new Promise((resolve) => setTimeout(resolve, backoffTime))
              return sendMessage(message, retries - 1)
            } else if (error.response.status >= 400 && error.response.status < 500) {
              // Client errors - do not retry
              return { success: false, data: null, error: `Client error: ${error.response.data.error.message}` }
            }
          } else {
            console.error('Error fetching search results:', error)
          }
          throw error
        })

    const data = response.data
    console.log('API response:', data?.candidates?.[0]?.content?.parts?.[0]?.text)
    const text =
      data?.parts?.[0]?.text ||
      data?.contents?.[0]?.parts?.[0]?.text ||
      data?.output?.[0]?.content?.[0]?.text ||
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      JSON.stringify(data)

    return { success: true, data: text, error: null }
  } catch (error) {
    return { success: false, data: null, error: 'Failed to fetch search results. Please try again later.' }
  }
}   
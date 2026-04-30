// - Implement a reusable function `generateContent(messages)`
// - Follow clean architecture (separate config, utils, service)
// - Add robust input and output guardrails:
//   - Block harmful, illegal, explicit, or sensitive content
//   - Use keyword filtering + extensible moderation logic
// - Add a strong system prompt enforcing responsible AI usage
// - Handle errors gracefully with meaningful messages
// - Validate API response structure before parsing
// - Return structured JSON response:
//   { success: boolean, content?: string, error?: string, isGuardrail?: boolean }[3:30 PM]// end points is https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent
// use axios

import axios from 'axios'
const API_KEY = 'AIzaSyD9gL0vSBlRdv7mD-O3Y0tlO1H3-9DcEuY'
// const API_KEY = ''

 const MODEL_NAME = 'gemini-3-flash-preview'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

export const generateContent = async (messages) => {
    try {
        // Accept either a single message string or an array of messages
        const messageArray = typeof messages === 'string'
            ? [{ role: 'user', content: messages }]
            : Array.isArray(messages)
                ? messages
                : []

        if (!messageArray.length) {
            throw new Error('No messages provided to generateContent')
        }

        // Convert messages format to Google's expected format
        const contents = messageArray.map(msg => ({
            role: msg.role,
            parts: [
                {
                    text: msg.content
                }
            ]
        }))

        const response = await axios.post(API_URL, {
            contents: contents
        }, {
            headers: {
                'Content-Type': 'application/json'
                // API key is passed as query parameter in URL, no header needed
            }
        })

        console.log('Response from Google API:', response.data)

        // Parse Google's response format
        const candidates = response.data.candidates
        if (candidates && candidates.length > 0) {
            return candidates[0].content.parts[0].text
        }
        throw new Error('No response from Google API')
    } catch (error) {
        // handle error codes and provide meaningful messages
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    throw new Error('Bad Request (400). Please check your input and try again.')
                case 401:
                    throw new Error('Unauthorized (401). Please check your API key and permissions.')
                case 403:
                    throw new Error('Forbidden (403). You do not have access to this resource.')
                case 404:
                    throw new Error('Resource not found (404). Please check your request.')
                case 409:
                    throw new Error('Conflict (409). There is a conflict with your request. Please try again.')
                case 429:
                    throw new Error('Too Many Requests (429). You have exceeded your rate limit. Please try again later.')
                default:
                    throw new Error(`Error ${error.response.status}: ${error.response.data}`)
            }
        } else {
            throw new Error('An error occurred while fetching content. Please try again.')
        }
        console.error('Error generating content:', error.response?.data || error.message)
        throw error
    }
}   


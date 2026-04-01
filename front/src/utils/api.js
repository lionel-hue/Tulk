// front/src/utils/api.js
import axios from 'axios'

// Simple API client - NO CSRF, NO cookies
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
  // NO withCredentials! You're using tokens, not cookies
})

// Add auth token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token')
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    console.log('Token present:', !!token)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Handle errors
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  error => {
    console.error('=== API ERROR ===')
    console.error('URL:', error.config?.url)
    console.error('Method:', error.config?.method)
    console.error('Status:', error.response?.status)
    console.error('Data:', error.response?.data)
    console.error('Message:', error.message)
    console.error('================')

    if (!error.response) {
      // Network error (server down, no internet, etc.)
      console.error('Network error - no response from server')
      throw new Error(
        'Erreur de connexion. Vérifiez que le serveur est démarré.'
      )
    }

    const { status, data } = error.response

    if (status === 401) {
      // Unauthorized - clear token
      console.warn('401 Unauthorized - clearing token')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      // Don't redirect here, let the component handle it
    }

    if (status === 404) {
      console.warn('404 Not Found:', error.config?.url)
    }

    if (status === 500) {
      console.error('500 Server Error:', data)
    }

    throw new Error(data?.message || 'Une erreur est survenue')
  }
)

export default api
export { api }

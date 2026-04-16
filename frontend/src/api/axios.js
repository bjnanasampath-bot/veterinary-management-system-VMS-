import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry && !original.url.includes('/login') && !original.url.includes('/google-auth')) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/token/refresh/`, { refresh })
        localStorage.setItem('access_token', res.data.access)
        original.headers.Authorization = `Bearer ${res.data.access}`
        return api(original)
      } catch (err) {
        localStorage.clear()
        if (window.location.pathname !== '/login' && window.location.pathname !== '/' && window.location.pathname !== '/client-portal') {
           window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    }
    
    if (error.response?.status !== 401) {
      if (original.url.includes('/logout')) {
         return Promise.reject(error);
      }
      const resData = error.response?.data || {}
      const fieldErrors = resData.errors || {}
      const firstFieldError = Object.values(fieldErrors).flat()[0]
      let msg = firstFieldError || resData.message || resData.detail
      
      // If no response from server
      if (!error.response && error.message === 'Network Error') {
        msg = 'Unable to connect to the server. Please check your connection.'
      } else if (!msg) {
        msg = 'Something went wrong'
      }
      
      toast.error(msg)
    }
    return Promise.reject(error)
  }
)

export default api

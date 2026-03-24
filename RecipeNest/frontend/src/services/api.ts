import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      
      // Store token and user info
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { success: true, user }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      return { success: false, message }
    }
  },
  
  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData)
      return { success: true, data: response.data }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      return { success: false, message }
    }
  },
  
  getCurrentUser: () =>
    api.get('/auth/me'),
}

export const chefsAPI = {
  getAll: (search?: string) =>
    api.get('/chefs', { params: { search } }),
  
  getById: (id: number) =>
    api.get(`/chefs/${id}`),
  
  getRecipes: (id: number, params?: any) =>
    api.get(`/chefs/${id}/recipes`, { params }),
}

export const recipesAPI = {
  getAll: (params?: any) =>
    api.get('/recipes', { params }),
  
  getById: (id: number) =>
    api.get(`/recipes/${id}`),
  
  create: (data: any) =>
    api.post('/recipes', data),
  
  update: (id: number, data: any) =>
    api.put(`/recipes/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/recipes/${id}`),
}

export const filesAPI = {
  upload: (file: File, folder?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (folder) formData.append('folder', folder)
    
    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export default api

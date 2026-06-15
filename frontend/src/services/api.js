import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const client = axios.create({ baseURL: API_BASE })

// Add JWT to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userEmail')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export async function login(email, password) {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  const res = await client.post('/auth/login', form)
  return res.data
}

export async function register(username, email, password) {
  const res = await client.post('/auth/register', { username, email, password })
  return res.data
}

export async function getStudents() {
  const res = await client.get('/students')
  return res.data
}

export async function searchStudent(rollNumber) {
  const res = await client.get(`/students/search?roll_number=${rollNumber}`)
  return res.data
}

export async function createStudent(payload) {
  const res = await client.post('/students', payload)
  return res.data
}

export async function updateStudent(studentId, payload) {
  const res = await client.put(`/students/${studentId}`, payload)
  return res.data
}

export async function deleteStudent(studentId) {
  const res = await client.delete(`/students/${studentId}`)
  return res.data
}

export async function getPerformance() {
  const res = await client.get('/performance')
  return res.data
}

export async function createPerformance(payload) {
  const res = await client.post('/performance', payload)
  return res.data
}

export async function updatePerformance(studentId, payload) {
  const res = await client.put(`/performance/${studentId}`, payload)
  return res.data
}

export async function deletePerformance(studentId) {
  const res = await client.delete(`/performance/${studentId}`)
  return res.data
}

export async function generateSummary(studentId) {
  const res = await client.post(`/summary/generate/${studentId}`)
  return res.data
}

export async function saveSummary(studentId, summary) {
  const res = await client.post(`/summary/save/${studentId}`, { summary })
  return res.data
}

export async function getSummary(studentId) {
  const res = await client.get(`/summary/${studentId}`)
  return res.data
}

export async function deleteSummary(studentId) {
  const res = await client.delete(`/summary/${studentId}`)
  return res.data
}

import axios from 'axios'

// En producción usa la variable de entorno VITE_API_URL
// En desarrollo usa el proxy de Vite (/api)
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/control-rifas-2026-lh'
    }
    return Promise.reject(err)
  }
)

export default api

export const rafflesApi = {
  getAll: () => api.get('/raffles'),
  getActive: () => api.get('/raffles/active'),
  getOne: (id) => api.get(`/raffles/${id}`),
  getStats: (id) => api.get(`/raffles/${id}/stats`),
  getAvailable: (id) => api.get(`/raffles/${id}/available-numbers`),
  getSold: (id) => api.get(`/raffles/${id}/sold-numbers`),
  getBlessedNumbers: (id) => api.get(`/raffles/${id}/blessed-numbers`),
  create: (formData) => api.post('/raffles', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.patch(`/raffles/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateStatus: (id, status) => api.patch(`/raffles/${id}/status`, { status }),
}

export const purchasesApi = {
  getPackages: () => api.get('/packages'),
  create: (raffleId, data) => api.post(`/raffles/${raffleId}/purchases`, data),
  uploadVoucher: (purchaseId, formData) =>
    api.post(`/purchases/${purchaseId}/voucher`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getByRaffle: (raffleId) => api.get(`/raffles/${raffleId}/purchases`),
  getTopBuyers: (raffleId) => api.get(`/raffles/${raffleId}/purchases-stats/top-buyers`),
  getTopBuyersByDay: (raffleId, date) => api.get(`/raffles/${raffleId}/purchases-stats/top-buyers-by-day`, { params: { date } }),
  findTicketOwner: (raffleId, number) => api.get(`/raffles/${raffleId}/purchases-stats/find-number/${number}`),
  checkMyNumbers: (email, phone) => api.post('/purchases/check-my-numbers', { email, phone }),
  lookupBuyer: (email) => api.get('/purchases/lookup-buyer', { params: { email } }),
  approve: (raffleId, purchaseId) => api.patch(`/raffles/${raffleId}/purchases/${purchaseId}/approve`),
  reject: (raffleId, purchaseId) => api.patch(`/raffles/${raffleId}/purchases/${purchaseId}/reject`),
  cancel: (raffleId, purchaseId) => api.patch(`/raffles/${raffleId}/purchases/${purchaseId}/cancel`),
}

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  profile: () => api.get('/auth/profile'),
}

export const settingsApi = {
  get: () => api.get('/settings'),
  update: (formData) => api.patch('/settings', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

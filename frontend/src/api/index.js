import api from './axios'

export const authApi = {
  login: (data) => api.post('/auth/login/', data),
  register: (data) => api.post('/auth/register/', data),
  logout: (data) => api.post('/auth/logout/', data),
  googleAuth: (data) => api.post('/auth/google-auth/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/', data),
  changePassword: (data) => api.post('/auth/change-password/', data),
  forgotPassword: (email) => api.post('/auth/forgot-password/', { email }),
  verifyOTP: (data) => api.post('/auth/verify-otp/', data),
}

export const ownerApi = {
  getAll: (params) => api.get('/owners/', { params }),
  getById: (id) => api.get(`/owners/${id}/`),
  create: (data) => api.post('/owners/', data),
  update: (id, data) => api.put(`/owners/${id}/`, data),
  delete: (id) => api.delete(`/owners/${id}/`),
  getPets: (id) => api.get(`/owners/${id}/pets/`),
}

export const petApi = {
  getAll: (params) => api.get('/pets/', { params }),
  getById: (id) => api.get(`/pets/${id}/`),
  create: (data) => api.post('/pets/', data),
  update: (id, data) => api.put(`/pets/${id}/`, data),
  delete: (id) => api.delete(`/pets/${id}/`),
  getMedicalHistory: (id) => api.get(`/pets/${id}/medical-history/`),
}

export const doctorApi = {
  getAll: (params) => api.get('/doctors/', { params }),
  getById: (id) => api.get(`/doctors/${id}/`),
  create: (data) => api.post('/doctors/', data),
  update: (id, data) => api.put(`/doctors/${id}/`, data),
  delete: (id) => api.delete(`/doctors/${id}/`),
}

export const appointmentApi = {
  getAll: (params) => api.get('/appointments/', { params }),
  getById: (id) => api.get(`/appointments/${id}/`),
  create: (data) => api.post('/appointments/', data),
  update: (id, data) => api.put(`/appointments/${id}/`, data),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status/`, { status }),
  delete: (id) => api.delete(`/appointments/${id}/`),
  getToday: () => api.get('/appointments/today/'),
}

export const treatmentApi = {
  getAll: (params) => api.get('/treatments/', { params }),
  getById: (id) => api.get(`/treatments/${id}/`),
  create: (data) => api.post('/treatments/', data),
  update: (id, data) => api.put(`/treatments/${id}/`, data),
  delete: (id) => api.delete(`/treatments/${id}/`),
}

export const vaccinationApi = {
  getAll: (params) => api.get('/vaccinations/', { params }),
  getById: (id) => api.get(`/vaccinations/${id}/`),
  create: (data) => api.post('/vaccinations/', data),
  update: (id, data) => api.put(`/vaccinations/${id}/`, data),
  delete: (id) => api.delete(`/vaccinations/${id}/`),
  getOverdue: () => api.get('/vaccinations/overdue/'),
  getUpcoming: () => api.get('/vaccinations/upcoming/'),
}

export const billingApi = {
  getAll: (params) => api.get('/billing/', { params }),
  getById: (id) => api.get(`/billing/${id}/`),
  create: (data) => api.post('/billing/', data),
  update: (id, data) => api.put(`/billing/${id}/`, data),
  delete: (id) => api.delete(`/billing/${id}/`),
  makePayment: (id, data) => api.post(`/billing/${id}/payment/`, data),
  sendEmail: (id) => api.post(`/billing/${id}/send-email/`),
}

export const reportApi = {
  getDashboardStats: () => api.get('/reports/dashboard/'),
  getRevenueReport: (params) => api.get('/reports/revenue/', { params }),
  getAppointmentReport: (params) => api.get('/reports/appointments/', { params }),
  getPetSpeciesReport: () => api.get('/reports/pets/species/'),
}

export const labTestApi = {
  getAll: (params) => api.get('/treatments/lab-tests/', { params }),
  getById: (id) => api.get(`/treatments/lab-tests/${id}/`),
  create: (data) => api.post('/treatments/lab-tests/', data),
  update: (id, data) => api.put(`/treatments/lab-tests/${id}/`, data),
  delete: (id) => api.delete(`/treatments/lab-tests/${id}/`),
}

export const surgeryApi = {
  getAll: (params) => api.get('/treatments/surgeries/', { params }),
  getById: (id) => api.get(`/treatments/surgeries/${id}/`),
  create: (data) => api.post('/treatments/surgeries/', data),
  update: (id, data) => api.put(`/treatments/surgeries/${id}/`, data),
  delete: (id) => api.delete(`/treatments/surgeries/${id}/`),
}

export const pharmacyApi = {
  getAll: (params) => api.get('/pharmacy/items/', { params }),
  getById: (id) => api.get(`/pharmacy/items/${id}/`),
  create: (data) => api.post('/pharmacy/items/', data),
  update: (id, data) => api.put(`/pharmacy/items/${id}/`, data),
  delete: (id) => api.delete(`/pharmacy/items/${id}/`),
}

export const prescriptionApi = {
  getAll: (params) => api.get('/pharmacy/prescriptions/', { params }),
  getById: (id) => api.get(`/pharmacy/prescriptions/${id}/`),
  create: (data) => api.post('/pharmacy/prescriptions/', data),
  update: (id, data) => api.put(`/pharmacy/prescriptions/${id}/`, data),
  delete: (id) => api.delete(`/pharmacy/prescriptions/${id}/`),
}

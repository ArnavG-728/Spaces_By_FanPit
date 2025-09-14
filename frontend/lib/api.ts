import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
console.log('[API] baseURL =', apiBaseUrl);

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

let accessToken = '';

export const setAccessToken = (token: string) => {
  accessToken = token;
};

api.interceptors.request.use(
  (config: any) => {
    if (accessToken) {
      console.log('Attaching access token to request');
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  },
);


// Auth API
export const authAPI = {
  signup: (data: { name: string; email: string; password: string; role: string }) =>
    api.post('/api/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  profile: () => api.get('/api/auth/profile'),
};

// Spaces API
export const spacesAPI = {
  getAll: () => api.get('/api/spaces'),
  getById: (id: string) => api.get(`/api/spaces/${id}`),
  create: (data: any) => api.post('/api/spaces', data),
  update: (id: string, data: any) => api.patch(`/api/spaces/${id}`, data),
  delete: (id: string) => api.delete(`/api/spaces/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getAll: () => api.get('/api/bookings'),
  getById: (id: string) => api.get(`/api/bookings/${id}`),
  create: (data: any) => api.post('/api/bookings', data),
  update: (id: string, data: any) => api.patch(`/api/bookings/${id}`, data),
  delete: (id: string) => api.delete(`/api/bookings/${id}`),
};

// Payments API
export const paymentsAPI = {
  createOrder: (data: { bookingId: string; amount: number }) =>
    api.post('/api/payments/create-order', data),
  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => api.post('/api/payments/verify', data),
};

// Check-ins API
export const checkInsAPI = {
  getAll: () => api.get('/api/check-ins'),
  getById: (id: string) => api.get(`/api/check-ins/${id}`),
  create: (data: any) => api.post('/api/check-ins', data),
  update: (id: string, data: any) => api.patch(`/api/check-ins/${id}`, data),
};

// Issues API
export const issuesAPI = {
  getAll: () => api.get('/api/issues'),
  getById: (id: string) => api.get(`/api/issues/${id}`),
  create: (data: any) => api.post('/api/issues', data),
  update: (id: string, data: any) => api.patch(`/api/issues/${id}`, data),
};

export default api;
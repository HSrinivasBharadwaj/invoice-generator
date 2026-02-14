import axios from 'axios';


//Create axios instance
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

// Request interceptor (add token or modify requests)
api.interceptors.request.use((config) => {
    return config
},(error) => {
    return Promise.reject(error);
})

// Response interceptor (handle errors globally)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    }
    
    if (error.response?.status === 500) {
      // Server error
      console.error('Server error');
    }
    
    return Promise.reject(error);
  }
);
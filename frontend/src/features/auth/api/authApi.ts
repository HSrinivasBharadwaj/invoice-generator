import { api } from '@/lib/axios';
import type { User, LoginCredentials, SignupCredentials } from "../../../types/index";


export const authApi = {
  // Login
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Signup
  signup: async (credentials: SignupCredentials) => {
    const response = await api.post('/auth/signup', credentials);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};